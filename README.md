# QuickBooks Web Connect (`.QBO`) `INTU.BID` Error Fixer & Specification Guide

Fix the **"QuickBooks is unable to verify the Financial Institution information for this download"** error in `.QBO` / `.OFX` bank and credit card files—either instantly in your browser (zero install) or via the lightweight zero-dependency Node.js CLI included in this repository.

---

## Instant Browser Utilities (No Install · 100% Client-Side)

If you are a bookkeeper, CPA, or business owner and just want to fix or convert a statement file immediately:

- **[Free `.QBO` / `INTU.BID` Repair Tool](https://ofxready.com/fix-qbo-intu-bid-error)** — Drop a rejected `.QBO` or `.OFX` file to patch `<INTU.BID>`, `OFXHEADER:100`, unescaped `&` entities, and >32-character `<NAME>` overflows locally in your browser.
- **[Free CSV to `.QBO` Web Connect Converter](https://ofxready.com/csv-to-qbo-converter)** — Convert 3-column (`Date, Description, Amount`) or 4-column (`Debit / Credit`) CSV spreadsheets into valid QuickBooks Desktop & Online `.QBO` files (`USD`, `CAD`, `GBP`, `AUD`, `EUR`).
- **[PDF Bank & Credit Card Statement to `.QBO` & Xero CSV Converter](https://ofxready.com)** — Extract historical or scanned paper PDF statements with automatic `Opening + Credits − Debits = Ending Balance` mathematical verification (no recurring subscription).

---

## Why QuickBooks Rejects `.QBO` Files

Both **QuickBooks Desktop** (`File → Utilities → Import → Web Connect Files`) and **QuickBooks Online** validate incoming `.QBO` files against Intuit's active Financial Institution directory (`fidir.txt`) and strict OFX 1.02 SGML rules. Imports fail when any of the following occur:

1. **Retired or Missing `<INTU.BID>` Identifier**  
   Regional banks, credit unions, or generic OFX exporters often omit `<INTU.BID>` or output a discontinued code. Replacing `<INTU.BID>` with a verified active code (such as `3000`) allows QuickBooks to accept the file and lets you map it to **any** existing bank or credit card ledger account in your Chart of Accounts.
2. **Missing SGML OFX 102 Header Block**  
   QuickBooks Desktop requires the 9-line plain-text `OFXHEADER:100` / `VERSION:102` preamble directly above `<OFX>` with no leading UTF-8 BOM whitespace.
3. **`<NAME>` (Payee) Exceeding 32 Characters**  
   In OFX 1.02, `<NAME>` is strictly limited to **32 characters**, and `<MEMO>` to **255 characters**. Unescaped `&`, `<`, or `>` characters inside merchant names will silently abort parsing.
4. **Credit Card Charges Wrapped in `<BANKMSGSRSV1>`**  
   Checking and savings statements belong inside `<BANKMSGSRSV1>`, whereas credit cards must use `<CREDITCARDMSGSRSV1>` (`<CCSTMTRS>`) so purchases import as credit card charges rather than positive bank deposits.

---

## Verified `<INTU.BID>` Bank Identifier Reference

> **Tip for Bookkeepers:** The `<INTU.BID>` tag in a `.QBO` header only satisfies QuickBooks' import gatekeeper—it does **not** force you to use that bank's name inside QuickBooks. During your first import, QuickBooks prompts you to link the file to whichever bank or credit card account you choose.

| Financial Institution | `<INTU.BID>` | Default Routing (`<BANKID>`) | Typical Account Types | Bank-Specific PDF Guide |
| :--- | :--- | :--- | :--- | :--- |
| **Universal Fallback** (Wells Fargo) | `3000` | `121000248` | Checking, Savings, Credit Card, Regional/International | [Wells Fargo PDF to QBO](https://ofxready.com/banks/wells-fargo-pdf-to-qbo) |
| **JPMorgan Chase** | `10898` | `021000021` | Business Complete Checking, Ink Credit Cards | [Chase PDF to QBO](https://ofxready.com/banks/chase-pdf-to-qbo) |
| **Bank of America** | `6812` | `026009593` | Business Advantage, Personal Checking & Cards | [Bank of America PDF to QBO](https://ofxready.com/banks/bank-of-america-pdf-to-qbo) |
| **American Express** | `3101` | `000000000` | Business Platinum, Gold, Blue Cash (`CREDITCARD`) | [Amex PDF to QBO](https://ofxready.com/banks/amex-pdf-to-qbo) |
| **Citibank** | `24909` | `021000089` | Citi Checking & Citi Cards | [OFXReady Converter](https://ofxready.com) |
| **Capital One** | `15688` | `051405515` | Spark Business, 360 Checking & Cards | [OFXReady Converter](https://ofxready.com) |
| **Apple Card** (via universal `3000`) | `3000` | `000000000` | Monthly Wallet PDF (`CREDITCARD`) | [Apple Card PDF to QBO](https://ofxready.com/banks/apple-card-pdf-to-qbo) |
| **Mercury** (via universal `3000`) | `3000` | `084106768` | Startup Checking, Treasury & IO Card | [Mercury PDF to QBO](https://ofxready.com/banks/mercury-pdf-to-qbo) |
| **Barclays UK / RBC / CommBank AU** | `3000` | `000000000` | Multi-currency (`GBP`, `CAD`, `AUD`) `<CURDEF>` | [UK](https://ofxready.com/banks/barclays-uk-pdf-to-qbo) · [CA](https://ofxready.com/banks/rbc-canada-pdf-to-qbo) · [AU](https://ofxready.com/banks/commbank-australia-pdf-to-xero-qbo) |

---

## Minimal Valid `.QBO` (OFX 102) File Template

### Checking / Savings (`<BANKMSGSRSV1>`)

```sgml
OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<DTSERVER>20261031120000
<LANGUAGE>ENG
<FI>
<ORG>WELLS FARGO
<FID>3000
</FI>
<INTU.BID>3000
<INTU.USERID>OFXREADY
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>0
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<STMTRS>
<CURDEF>USD
<BANKACCTFROM>
<BANKID>121000248
<ACCTID>4829
<ACCTTYPE>CHECKING
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>20261001120000
<DTEND>20261031120000
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20261002120000
<TRNAMT>3450.00
<FITID>202610020001
<NAME>STRIPE PAYOUT
<MEMO>STRIPE INC TRANSFER #991
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261005120000
<TRNAMT>-1820.50
<FITID>202610050002
<NAME>GUSTO PAYROLL
<MEMO>GUSTO ACH DEBIT
</STMTTRN>
</BANKTRANLIST>
<LEDGERBAL>
<BALAMT>1629.50
<DTASOF>20261031120000
</LEDGERBAL>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>
```

---

## Command-Line `.QBO` Repair Script (Node.js 18+)

For developers automating local statement workflows, this repo includes `fix-qbo.mjs` (zero external dependencies):

```bash
git clone https://github.com/lucas12188/quickbooks-intu-bid-fixer.git
cd quickbooks-intu-bid-fixer

# Patch a broken .QBO or .OFX file with universal INTU.BID 3000 (or pass --bid=10898)
node fix-qbo.mjs broken-statement.ofx repaired-statement.qbo --bid=3000
```

What `fix-qbo.mjs` fixes automatically:
- Strips UTF-8 BOM and prepends a compliant `OFXHEADER:100` / `VERSION:102` header if missing
- Injects or replaces `<INTU.BID>` inside `<SONRS>`
- Truncates `<NAME>` tags to 32 characters and sanitizes unescaped `&` characters

---

## License

MIT License — see [LICENSE](./LICENSE).
