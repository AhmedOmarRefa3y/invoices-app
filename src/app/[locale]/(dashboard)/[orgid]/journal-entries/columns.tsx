'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { formatCurrency } from '@/lib/utils';

export type JournalEntry = {
  id: string;
  reference: string;
  journalName: string;
  date: Date;
  description: string;
  totalAmount: number;
  currency: string;
  state: 'draft' | 'posted' | 'cancel';
};

export const columns: ColumnDef<JournalEntry>[] = [
  {
    accessorKey: 'reference',
    header: () => {
      const t = useTranslations('JournalEntries');
      return t('reference');
    },
    cell: ({ row }) => {
      const t = useTranslations('JournalEntries');
      const locale = useLocale();
      const router = useRouter();

      return (
        <div 
          className="font-medium text-blue-600 hover:underline cursor-pointer"
          onClick={() => router.push(`/${locale}/journal-entries/${row.original.id}`)}
        >
          {row.getValue('reference')}
        </div>
      );
    },
  },
  {
    accessorKey: 'journalName',
    header: () => {
      const t = useTranslations('JournalEntries');
      return t('journal');
    },
  },
  {
    accessorKey: 'date',
    header: () => {
      const t = useTranslations('JournalEntries');
      return t('date');
    },
    cell: ({ row }) => {
      const locale = useLocale();
      return (
        <div>
          {format(row.getValue('date') as Date, 'dd/MM/yyyy', {
            locale: locale === 'ar' ? ar : undefined,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: () => {
      const t = useTranslations('JournalEntries');
      return t('description');
    },
  },
  {
    accessorKey: 'totalAmount',
    header: () => {
      const t = useTranslations('JournalEntries');
      return t('totalAmount');
    },
    cell: ({ row }) => {
      const currency = row.original.currency;
      const amount = row.getValue('totalAmount') as number;
      
      return (
        <div className="text-right">
          {formatCurrency(amount, currency)}
        </div>
      );
    },
  },
  {
    accessorKey: 'state',
    header: () => {
      const t = useTranslations('JournalEntries');
      return t('state');
    },
    cell: ({ row }) => {
      const t = useTranslations('JournalEntries');
      const state = row.getValue('state') as 'draft' | 'posted' | 'cancel';
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';

      switch (state) {
        case 'posted':
          variant = 'secondary';
          break;
        case 'cancel':
          variant = 'destructive';
          break;
        default:
          variant = 'default';
      }

      return (
        <Badge variant={variant}>
          {t(state)}
        </Badge>
      );
    },
  },
];