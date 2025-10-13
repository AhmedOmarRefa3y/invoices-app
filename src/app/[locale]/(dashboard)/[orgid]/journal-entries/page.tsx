import React from 'react';
import { auth } from '@/auth';
import prismaDb from '@/lib/prisma';
import { redirect } from '@/i18n/routing';
import { TableUi as DataTable } from '@/components/table';
import { columns } from './columns';
import { formatCurrency } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

interface JournalEntry {
  id: string;
  reference: string;
  journalName: string;
  date: Date;
  description: string;
  totalAmount: number;
  currency: string;
  state: 'draft' | 'posted' | 'cancel';
}

interface PageProps {
  params: Promise<{
    orgid: string;
    locale: string;
  }>;
}

const JournalEntriesPage = async ({ params }: PageProps) => {
  const { orgid } = await params;
  const user = await auth();

  if (!user?.user) {
    redirect({ href: '/login', locale: 'en' });
    return null;
  }

  const t = await getTranslations('JournalEntries');

  // Fetch journal entries with related data
  const journalEntries = await prismaDb.journalEntry.findMany({
    where: {
      organizationId: orgid,
    },
    include: {
      lines: {
        include: {
          account: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
    take: 50, // Limit to recent entries
  });

  // Format the data for the table
  const formattedEntries: JournalEntry[] = journalEntries.map(entry => {
    // Calculate the total amount by summing debit values (for a journal entry, debits should equal credits)
    const totalAmount = entry.lines.reduce((sum, line) => {
      // Convert Prisma Decimal to number if needed
      const debitValue = Number(line.debit || 0);
      return sum + debitValue;
    }, 0);

    // Determine state based on the posted boolean field in the schema
    const state: 'draft' | 'posted' | 'cancel' = entry.posted ? 'posted' : 'draft';

    return {
      id: entry.id,
      reference: entry.reference,
      journalName: `Journal #${entry.number}`, // Use the number field as reference to the journal
      date: new Date(entry.date),
      description: entry.description || '',
      totalAmount,
      currency: entry.currency || 'USD',
      state,
    };
  });

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('journalEntries')}</h1>
        <p className="text-gray-600">{t('journalEntriesDescription')}</p>
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
  );
};

export default JournalEntriesPage;