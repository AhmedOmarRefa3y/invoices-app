'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import useModals from '@/lib/zustand/useModals';
import { useTranslations } from 'next-intl';
import { JournalEntry } from './columns';
import { TableUi as DataTable } from '@/components/table';
import { columns } from './columns';
import AddNewJournalEntryModal from '@/components/modals/AddNewJournalEntryModal';

// Define types for our data
interface JournalEntryLine {
  id: string;
  organizationId: string;
  journalId: string;
  accountId: string;
  description: string | null;
  debit: number; // Decimal converted to number
  credit: number; // Decimal converted to number
  currency: string;
  exchangeRate: number | null; // Decimal converted to number
  reference: string | null;
  createdAt: Date;
  account: {
    id: string;
    code: string;
    name: string;
    type: string;
    normalSide: string;
    parentId: string | null;
    isLeaf: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface JournalEntryFromServer {
  id: string;
  organizationId: string;
  number: number;
  date: Date;
  description: string | null;
  posted: boolean;
  lines: JournalEntryLine[];
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PageClientProps {
  params: {
    orgid: string;
    locale: string;
  };
  journalEntries: JournalEntryFromServer[];
}

const JournalEntriesPageClient = ({ params, journalEntries }: PageClientProps) => {
  const t = useTranslations('JournalEntries');
  const { SetAddJournalEntryModalIsOpen } = useModals();

  // Format the data for the table
  const formattedEntries: JournalEntry[] = journalEntries.map(entry => {
    // Calculate the total amount by summing debit values (for a journal entry, debits should equal credits)
    const totalAmount = entry.lines.reduce((sum: number, line: JournalEntryLine) => {
      const debitValue = Number(line.debit || 0);
      return sum + debitValue;
    }, 0);

    // Determine state based on the posted boolean field in the schema
    const state: 'draft' | 'posted' | 'cancel' = entry.posted ? 'posted' : 'draft';

    return {
      id: entry.id,
      reference: entry.reference || `JRN-${entry.number}`, // Use reference if available, otherwise create from number
      journalName: `Journal #${entry.number}`, // Use the number field as reference to the journal
      date: new Date(entry.date),
      description: entry.description || '',
      totalAmount,
      currency: entry.currency || 'USD',
      state,
    };
  });

  return (
    <>
      <div className="p-4">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{t('journalEntries')}</h1>
            <p className="text-gray-600">{t('journalEntriesDescription')}</p>
          </div>
          <Button 
            onClick={() => SetAddJournalEntryModalIsOpen(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('add_journal_entry')}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <DataTable
            columns={columns}
            data={formattedEntries}
            filterEnabled={true}
            filterAccessorKey="reference"
            filterplaceholder={t('filterPlaceholder')}
          />
        </div>
      </div>
      <AddNewJournalEntryModal />
    </>
  );
};

export default JournalEntriesPageClient;