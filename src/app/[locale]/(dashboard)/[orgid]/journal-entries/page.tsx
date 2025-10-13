import React from 'react';
import { auth } from '@/auth';
import prismaDb from '@/lib/prisma';
import { redirect } from '@/i18n/routing';
import { formatCurrency } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import JournalEntriesPageClient from './JournalEntriesPageClient';

interface PageProps {
  params: Promise<{
    orgid: string;
    locale: string;
  }>;
}

// Define types for our data processing
interface JournalEntryLine {
  id: string;
  organizationId: string;
  journalId: string;
  accountId: string;
  description: string | null;
  debit: any; // Will be a Prisma Decimal
  credit: any; // Will be a Prisma Decimal
  currency: string;
  exchangeRate: any | null; // Will be a Prisma Decimal
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

interface JournalEntry {
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

const JournalEntriesPage = async ({ params }: PageProps) => {
  const { orgid } = await params;
  const user = await auth();

  if (!user?.user) {
    redirect({ href: '/login', locale: 'en' });
    return null;
  }

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

  // Convert Prisma Decimal objects to JSON-serializable values
  const serializedJournalEntries = journalEntries.map(entry => ({
    ...entry,
    lines: entry.lines.map(line => ({
      ...line,
      debit: Number(line.debit),
      credit: Number(line.credit),
      exchangeRate: line.exchangeRate ? Number(line.exchangeRate) : null,
    }))
  }));

  return (
    <JournalEntriesPageClient 
      params={{ orgid, locale: 'en' }} 
      journalEntries={serializedJournalEntries} 
    />
  );
};

export default JournalEntriesPage;