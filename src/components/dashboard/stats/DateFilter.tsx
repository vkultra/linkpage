import { useState, useRef, useEffect, useCallback } from 'react'
import { DayPicker, getDefaultClassNames, type DateRange } from 'react-day-picker'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { ptBR } from 'date-fns/locale'
dayjs.locale('pt-br')
import { Calendar, ChevronDown } from 'lucide-react'
import { cn } from '../../../lib/utils'
import 'react-day-picker/style.css'

export type Preset = 'today' | '7d' | 'month' | 'last-month' | 'custom'

interface DateFilterProps {
  preset: Preset
  dateRange: { start: Date; end: Date }
  onPresetChange: (preset: Preset) => void
  onCustomRangeChange: (range: { start: Date; end: Date }) => void
}

const presets: { value: Preset; label: string }[] = [
  { value: 'today', label: 'Hoje' },
  { value: '7d', label: '7 dias' },
  { value: 'month', label: 'Mês' },
  { value: 'last-month', label: 'Últ. mês' },
]

function formatRange(start: Date, end: Date): string {
  const s = dayjs(start)
  const e = dayjs(end)

  if (s.isSame(e, 'day')) {
    return s.format('DD [de] MMM')
  }
  if (s.isSame(e, 'month')) {
    return `${s.format('DD')} – ${e.format('DD MMM')}`
  }
  if (s.isSame(e, 'year')) {
    return `${s.format('DD MMM')} – ${e.format('DD MMM')}`
  }
  return `${s.format("DD MMM 'YY")} – ${e.format("DD MMM 'YY")}`
}

export function DateFilter({
  preset,
  dateRange,
  onPresetChange,
  onCustomRangeChange,
}: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingRange, setPendingRange] = useState<DateRange | undefined>()
  const popoverRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const defaultClassNames = getDefaultClassNames()

  const close = useCallback(() => {
    setIsOpen(false)
    setPendingRange(undefined)
  }, [])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, close])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  const handleRangeSelect = useCallback(
    (range: DateRange | undefined) => {
      setPendingRange(range)
      if (range?.from && range?.to) {
        const start = new Date(range.from)
        start.setHours(0, 0, 0, 0)
        const end = new Date(range.to)
        end.setHours(23, 59, 59, 999)
        onCustomRangeChange({ start, end })
        setIsOpen(false)
        setPendingRange(undefined)
      }
    },
    [onCustomRangeChange],
  )

  const toggleCalendar = () => {
    if (isOpen) {
      close()
    } else {
      setPendingRange(
        preset === 'custom'
          ? { from: dateRange.start, to: dateRange.end }
          : undefined,
      )
      setIsOpen(true)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Preset buttons */}
      <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-slate-600">
        {presets.map((p, i) => (
          <button
            key={p.value}
            onClick={() => onPresetChange(p.value)}
            className={cn(
              'px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
              i > 0 && 'border-l border-gray-200 dark:border-slate-600',
              preset === p.value
                ? 'bg-gray-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Date range button + calendar popover */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={toggleCalendar}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
            preset === 'custom'
              ? 'border-gray-900 bg-gray-900 text-white dark:border-slate-200 dark:bg-slate-200 dark:text-slate-900'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
          )}
        >
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden sm:inline">
            {formatRange(dateRange.start, dateRange.end)}
          </span>
          <ChevronDown
            className={cn(
              'h-3 w-3 shrink-0 transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        </button>

        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/20 sm:hidden"
              onClick={close}
            />

            {/* Calendar popover */}
            <div
              ref={popoverRef}
              className={cn(
                'z-50 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800',
                // Mobile: centered overlay
                'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                // Desktop: dropdown below button
                'sm:absolute sm:left-auto sm:top-full sm:right-0 sm:mt-2 sm:translate-x-0 sm:translate-y-0',
              )}
            >
              <DayPicker
                mode="range"
                locale={ptBR}
                selected={pendingRange}
                onSelect={handleRangeSelect}
                numberOfMonths={1}
                disabled={{ after: new Date() }}
                classNames={{
                  root: `${defaultClassNames.root} rdp-custom`,
                  chevron: `${defaultClassNames.chevron} !fill-gray-400 dark:!fill-slate-500`,
                  today: `${defaultClassNames.today} !font-bold`,
                  selected: `${defaultClassNames.selected}`,
                  range_start: `${defaultClassNames.range_start}`,
                  range_end: `${defaultClassNames.range_end}`,
                  range_middle: `${defaultClassNames.range_middle}`,
                  outside: `${defaultClassNames.outside} !opacity-30`,
                  disabled: `${defaultClassNames.disabled} !opacity-20`,
                }}
              />
              {pendingRange?.from && !pendingRange?.to && (
                <p className="mt-1 text-center text-xs text-gray-500 dark:text-slate-400">
                  Selecione a data final
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
