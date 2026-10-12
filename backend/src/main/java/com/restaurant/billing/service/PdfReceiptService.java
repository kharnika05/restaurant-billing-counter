package com.restaurant.billing.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.restaurant.billing.entity.Bill;
import com.restaurant.billing.entity.BillItem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfReceiptService {

    @Value("${app.restaurant.name:Royal Feast Dine & Lounge}")
    private String restaurantName;

    @Value("${app.restaurant.address:42 Gourmet Boulevard, Bengaluru}")
    private String restaurantAddress;

    @Value("${app.restaurant.phone:+91 98765 43210}")
    private String restaurantPhone;

    @Value("${app.restaurant.gst-number:29AABCU9603R1ZM}")
    private String gstNumber;

    @Value("${app.restaurant.currency-symbol:₹}")
    private String currencySymbol;

    public byte[] generateReceiptPdf(Bill bill) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A5, 20, 20, 25, 25);
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new Color(26, 46, 53));
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.DARK_GRAY);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.BLACK);
            Font boldBodyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.BLACK);
            Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new Color(16, 185, 129));

            // Header
            Paragraph title = new Paragraph(restaurantName, titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph address = new Paragraph(restaurantAddress + "\nPhone: " + restaurantPhone + " | GSTIN: " + gstNumber, subTitleFont);
            address.setAlignment(Element.ALIGN_CENTER);
            address.setSpacingAfter(10);
            document.add(address);

            // Bill Metadata Table
            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);
            metaTable.setWidths(new float[]{50, 50});

            String tableInfo = bill.getOrder() != null && bill.getOrder().getTable() != null
                    ? bill.getOrder().getTable().getTableNumber()
                    : (bill.getOrder() != null ? bill.getOrder().getOrderType().name() : "N/A");

            String cashierName = bill.getCashier() != null ? bill.getCashier().getFullName() : "System";
            String dateFormatted = bill.getCreatedAt().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm:ss"));

            addCell(metaTable, "Bill No: " + bill.getBillNumber(), bodyFont, Element.ALIGN_LEFT, false);
            addCell(metaTable, "Date: " + dateFormatted, bodyFont, Element.ALIGN_RIGHT, false);
            addCell(metaTable, "Order No: " + (bill.getOrder() != null ? bill.getOrder().getOrderNumber() : "N/A"), bodyFont, Element.ALIGN_LEFT, false);
            addCell(metaTable, "Table / Type: " + tableInfo, bodyFont, Element.ALIGN_RIGHT, false);
            addCell(metaTable, "Cashier: " + cashierName, bodyFont, Element.ALIGN_LEFT, false);
            addCell(metaTable, "Status: " + bill.getPaymentStatus().name(), boldBodyFont, Element.ALIGN_RIGHT, false);
            metaTable.setSpacingAfter(10);
            document.add(metaTable);

            // Items Table
            PdfPTable itemTable = new PdfPTable(4);
            itemTable.setWidthPercentage(100);
            itemTable.setWidths(new float[]{45, 15, 20, 20});

            addHeaderCell(itemTable, "Item Description", sectionFont, Element.ALIGN_LEFT);
            addHeaderCell(itemTable, "Qty", sectionFont, Element.ALIGN_CENTER);
            addHeaderCell(itemTable, "Rate (" + currencySymbol + ")", sectionFont, Element.ALIGN_RIGHT);
            addHeaderCell(itemTable, "Amount (" + currencySymbol + ")", sectionFont, Element.ALIGN_RIGHT);

            for (BillItem item : bill.getBillItems()) {
                addCell(itemTable, item.getItemName(), bodyFont, Element.ALIGN_LEFT, true);
                addCell(itemTable, String.valueOf(item.getQuantity()), bodyFont, Element.ALIGN_CENTER, true);
                addCell(itemTable, String.format("%.2f", item.getUnitPrice()), bodyFont, Element.ALIGN_RIGHT, true);
                addCell(itemTable, String.format("%.2f", item.getLineTotal()), bodyFont, Element.ALIGN_RIGHT, true);
            }
            itemTable.setSpacingAfter(10);
            document.add(itemTable);

            // Totals Summary Table
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(60);
            totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalTable.setWidths(new float[]{60, 40});

            addTotalRow(totalTable, "Subtotal:", String.format("%s %.2f", currencySymbol, bill.getSubtotal()), bodyFont);
            if (bill.getDiscountAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
                addTotalRow(totalTable, "Discount (" + bill.getDiscountType() + "):", String.format("-%s %.2f", currencySymbol, bill.getDiscountAmount()), bodyFont);
            }
            addTotalRow(totalTable, "Taxable Amount:", String.format("%s %.2f", currencySymbol, bill.getTaxableAmount()), bodyFont);
            addTotalRow(totalTable, "CGST (" + bill.getCgstRate() + "%):", String.format("%s %.2f", currencySymbol, bill.getCgstAmount()), bodyFont);
            addTotalRow(totalTable, "SGST (" + bill.getSgstRate() + "%):", String.format("%s %.2f", currencySymbol, bill.getSgstAmount()), bodyFont);
            addTotalRow(totalTable, "Grand Total:", String.format("%s %.2f", currencySymbol, bill.getGrandTotal()), totalFont);
            addTotalRow(totalTable, "Paid Amount:", String.format("%s %.2f", currencySymbol, bill.getPaidAmount()), boldBodyFont);
            addTotalRow(totalTable, "Balance Due:", String.format("%s %.2f", currencySymbol, bill.getBalanceAmount()), boldBodyFont);

            totalTable.setSpacingAfter(15);
            document.add(totalTable);

            // Footer
            Paragraph footer = new Paragraph("Thank you for dining with Royal Feast!\nPlease visit again soon.\n*** Computer Generated Tax Invoice ***", subTitleFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating receipt PDF: " + e.getMessage(), e);
        }
    }

    private void addHeaderCell(PdfPTable table, String text, Font font, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(align);
        cell.setBackgroundColor(new Color(243, 244, 246));
        cell.setPadding(5);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, String text, Font font, int align, boolean border) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(align);
        cell.setPadding(4);
        if (!border) {
            cell.setBorder(Rectangle.NO_BORDER);
        }
        table.addCell(cell);
    }

    private void addTotalRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell c1 = new PdfPCell(new Phrase(label, font));
        c1.setHorizontalAlignment(Element.ALIGN_RIGHT);
        c1.setBorder(Rectangle.NO_BORDER);
        c1.setPadding(3);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(value, font));
        c2.setHorizontalAlignment(Element.ALIGN_RIGHT);
        c2.setBorder(Rectangle.NO_BORDER);
        c2.setPadding(3);
        table.addCell(c2);
    }
}
