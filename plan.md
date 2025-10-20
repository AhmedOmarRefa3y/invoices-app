# Journal Transactions Page Implementation Plan

## Overview
The journal transactions page will display account transactions with running balances after each transaction. It will follow the same pattern as other pages in the application, using client-side data fetching with server actions.

## Database Structure Analysis
- `JournalEntry` model: Represents journal entries with number, date, description, posted status
- `JournalEntryLine` model: Individual lines in a journal entry with debit/credit amounts, account reference
- `LedgerAccount` model: Chart of accounts with code, name, type, normal side

## Implementation Plan

### 1. Server Actions File
Create `src/lib/actions/journal-transactions-actions.ts` with:
- `getJournalTransactions` function to fetch transactions from the database
- Calculate running account balances after each transaction
- Include proper error handling and authentication checks

### 2. Update JournalTransactionsColumnDataT Type
Modify the type definition in `JournalTransactionscolumns.tsx` to include:
- Account name/code
- Running balance calculation
- Transaction type (debit/credit)
- Date formatting
- Additional transaction details

### 3. Columns File Updates
Enhance the columns in `JournalTransactionscolumns.tsx` to show:
- Account name/code
- Transaction date
- Reference
- Debit amount
- Credit amount
- Running balance after transaction
- Transaction description

### 4. Client Page Implementation
Create a client component that:
- Uses useEffect to call server action for data fetching
- Displays the journal transactions in a table
- Shows running balances after each transaction
- Uses the same table UI component as other pages

### 5. Data Processing Logic
Implement logic to:
- Calculate running balances per account
- Show all transactions in chronological order
- Group transactions by account if needed
- Handle proper formatting of amounts and dates

### 6. Page Structure
- Move server logic to server actions
- Keep page.tsx as client component
- Use useState and useEffect for data fetching
- Display loading states appropriately

## Key Requirements
- Client-side data fetching using useEffect
- Server actions for database operations
- Maintain same UI/UX as other pages
- Follow existing code patterns and conventions
- Include proper TypeScript typing
- Handle account balances calculation correctly
- Support both debit and credit transactions