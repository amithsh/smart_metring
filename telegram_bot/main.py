import telebot
from pymongo import MongoClient
import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

import datetime
import uuid
os.environ["INVOICE_LANG"] = "en"

# MongoDB connection
clienturi = "mongodb+srv://amithsh:cWBc0tCMG0Jo1FVT@cluster0.xjqyh7x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
dbname = "test"
collectionname = "utilitydatas"

# Telegram bot token
TOKEN = "7045068514:AAFqu4tgdCcXgy9pNP2mExOQUIYferolRfI"

# Connect to MongoDB
try:
    client = MongoClient(clienturi)
    db = client[dbname]
    collection = db[collectionname]
    print("Connected to MongoDB successfully.")
except Exception as e:
    print("Failed to connect to MongoDB:", e)

# Create bot instance
bot = telebot.TeleBot(TOKEN)

menu_keyboard = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
menu_keyboard.row('/hi')

# Welcome message
@bot.message_handler(commands=['hi'])
def start(message):
    bot.reply_to(message, 'Welcome to BESCOM utility BOT \nplease enter your registed mobile number to check your running meter reading and bill :')

# Handle messages
@bot.message_handler(func=lambda message: True)
def handle_message(message):
    chat_id = message.chat.id
    message_text = message.text
    print(message_text)

    # Assuming message_text is the mobile number
    user = collection.find_one({"mobileNumber": message_text})

    if user:
        meter_reading = user.get("value")
        updated_at = user.get("updatedAt", "N/A")
        totalamount = calculate_bill(meter_reading)
        keyboard = telebot.types.InlineKeyboardMarkup()
        proceed_button = telebot.types.InlineKeyboardButton(text="Proceed", callback_data="proceed")
        rise_ticket_button = telebot.types.InlineKeyboardButton(text="Rise Ticket", callback_data="rise_ticket")


        keyboard.add(proceed_button, rise_ticket_button)
        bot.send_message(chat_id, f"Meter Reading: {meter_reading}\nReading Till Date: {updated_at}\nBill till date: {totalamount} rupees\n\nChoose an option:", reply_markup=keyboard)

        invoice_number = str(uuid.uuid4())[:8]  # Generate a unique identifier for the invoice number
        invoice_date = datetime.datetime.now().strftime("%Y-%m-%d")

         # Generate the invoice PDF with the dynamically generated invoice number and date
        




        invoice_data = {
            'invoice_number': invoice_number,
            'date': invoice_date,
            'client': 'BESCOM',
            'items': [
                {'description': 'Meter Reading', 'quantity': 1,  'total': totalamount}
            ]
        }
        invoice_path = generate_invoice_pdf(invoice_data)

        # Send the invoice PDF as a document
        bot.send_document(message.chat.id, open(invoice_path, 'rb'), caption="Your invoice")
    else:
        bot.reply_to(message, "please check your mobile number  and try again.")

# Proceed option
@bot.callback_query_handler(func=lambda call: call.data == "proceed")
def proceed(call):
    bot.answer_callback_query(call.id)
    bot.send_message(call.message.chat.id, "Invoice and payment link sent.")

    

# Rise ticket option
@bot.callback_query_handler(func=lambda call: call.data == "rise_ticket")
def rise_ticket(call):
    bot.answer_callback_query(call.id)
    # Send email to utility center (You need to implement this part)

def calculate_bill(meter_reading):
    if meter_reading <= 50:
        return meter_reading * 4.15  # 415 paise/unit
    elif meter_reading <= 100:
        return (50 * 4.15) + ((meter_reading - 50) * 5.60)  # 415 paise/unit for the first 50 units, 560 paise/unit for the rest
    elif meter_reading <= 200:
        return (50 * 4.15) + (50 * 5.60) + ((meter_reading - 100) * 7.15)  # 415 paise/unit for the first 50 units, 560 paise/unit for the next 50 units, 715 paise/unit for the rest
    else:
        return (50 * 4.15) + (50 * 5.60) + (100 * 7.15) + ((meter_reading - 200) * 8.20)  # 415 paise/unit for the first 50 units, 560 paise/unit for the next 50 units, 715 paise/unit for the next 100 units, 820 paise/unit for the rest

def generate_invoice_pdf(invoice_data):
    file_path = 'invoice.pdf'
    doc = SimpleDocTemplate(file_path, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    # Add invoice details
    elements.append(Paragraph("Invoice", styles['Title']))
    elements.append(Paragraph("Invoice Number: {}".format(invoice_data['invoice_number']), styles['Normal']))
    elements.append(Paragraph("Date: {}".format(invoice_data['date']), styles['Normal']))
    elements.append(Paragraph("Client: {}".format(invoice_data['client']), styles['Normal']))

    # Add items table
    items = invoice_data['items']
    items_data = [[item['description'], item['quantity'],  item['total']] for item in items]
    table_style = TableStyle([('BACKGROUND', (0, 0), (-1, 0), colors.gray),
                              ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                              ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                              ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                              ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                              ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                              ('GRID', (0, 0), (-1, -1), 1, colors.black)])
    t = Table(data=[['Description', 'Quantity',  'Total']] + items_data)
    t.setStyle(table_style)
    elements.append(t)

    # Calculate total amount
    total_amount = sum(item['total'] for item in items)
    elements.append(Paragraph("Total Amount: {}".format(total_amount), styles['Normal']))

    # Build PDF document
    doc.build(elements)
    return file_path

# Start the bot
bot.polling()
