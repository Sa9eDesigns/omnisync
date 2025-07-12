// Calendar Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Calendar props interface
export interface CalendarProps extends StyledProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date) => void;
  mode?: 'single' | 'multiple' | 'range';
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
}

// Calendar container
const CalendarContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'Calendar',
    defaultProps: {
      backgroundColor: 'white',
      borderRadius: 'lg',
      borderWidth: 1,
      borderColor: 'gray200',
      p: 4,
      width: 280,
    },
  }
);

// Calendar header
const CalendarHeader = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'CalendarHeader',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 4,
    },
  }
);

// Calendar navigation button
const CalendarNavButton = createStyledComponent(
  isWeb ? 'button' : 'TouchableOpacity',
  {
    name: 'CalendarNavButton',
    defaultProps: {
      p: 2,
      borderRadius: 'sm',
      backgroundColor: 'transparent',
      color: 'gray600',
      cursor: isWeb ? 'pointer' : undefined,
      hoverStyle: {
        backgroundColor: 'gray100',
        color: 'gray900',
      },
      pressStyle: {
        backgroundColor: 'gray200',
      },
    },
  }
);

// Calendar title
const CalendarTitle = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'CalendarTitle',
    defaultProps: {
      fontSize: 'base',
      fontWeight: 'semibold',
      color: 'gray900',
    },
  }
);

// Calendar grid
const CalendarGrid = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'CalendarGrid',
    defaultProps: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 1,
    },
  }
);

// Calendar day header
const CalendarDayHeader = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'CalendarDayHeader',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 32,
      fontSize: 'xs',
      fontWeight: 'medium',
      color: 'gray500',
      textAlign: 'center',
    },
  }
);

// Calendar day cell
const CalendarDayCell = createStyledComponent(
  isWeb ? 'button' : 'TouchableOpacity',
  {
    name: 'CalendarDayCell',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: 'sm',
      fontSize: 'sm',
      backgroundColor: 'transparent',
      color: 'gray900',
      cursor: isWeb ? 'pointer' : undefined,
      transition: 'all 0.2s',
      hoverStyle: {
        backgroundColor: 'gray100',
      },
      pressStyle: {
        backgroundColor: 'gray200',
      },
    },
    variants: {
      selected: {
        true: {
          backgroundColor: 'primary500',
          color: 'white',
          hoverStyle: {
            backgroundColor: 'primary600',
          },
        },
        false: {},
      },
      today: {
        true: {
          borderWidth: 1,
          borderColor: 'primary500',
        },
        false: {},
      },
      outside: {
        true: {
          color: 'gray400',
        },
        false: {},
      },
      disabled: {
        true: {
          opacity: 0.5,
          cursor: isWeb ? 'not-allowed' : undefined,
          pointerEvents: 'none',
        },
        false: {},
      },
    },
  }
);

// Navigation icons
const ChevronLeftIcon = () => {
  if (isWeb) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15,18 9,12 15,6" />
      </svg>
    );
  } else {
    const { Text } = require('react-native');
    return <Text style={{ fontSize: 16, color: 'currentColor' }}>‹</Text>;
  }
};

const ChevronRightIcon = () => {
  if (isWeb) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9,18 15,12 9,6" />
      </svg>
    );
  } else {
    const { Text } = require('react-native');
    return <Text style={{ fontSize: 16, color: 'currentColor' }}>›</Text>;
  }
};

// Utility functions
const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

const formatMonthYear = (date: Date, locale = 'en-US'): string => {
  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
};

// Main Calendar component
export const Calendar = forwardRef<any, CalendarProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      mode = 'single',
      disabled = false,
      minDate,
      maxDate,
      locale = 'en-US',
      weekStartsOn = 0,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || new Date());
    const [currentMonth, setCurrentMonth] = useState(
      controlledValue || defaultValue || new Date()
    );

    const isControlled = controlledValue !== undefined;
    const selectedDate = isControlled ? controlledValue : internalValue;

    // Handle date selection
    const handleDateSelect = (date: Date) => {
      if (disabled) return;

      // Check if date is within min/max bounds
      if (minDate && date < minDate) return;
      if (maxDate && date > maxDate) return;

      if (!isControlled) {
        setInternalValue(date);
      }
      onValueChange?.(date);
    };

    // Navigation handlers
    const goToPreviousMonth = () => {
      setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
      setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    // Generate calendar days
    const generateCalendarDays = () => {
      const daysInMonth = getDaysInMonth(currentMonth);
      const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
      const startDate = (firstDayOfMonth - weekStartsOn + 7) % 7;

      const days: Array<{
        date: Date;
        isCurrentMonth: boolean;
        isSelected: boolean;
        isToday: boolean;
        isDisabled: boolean;
      }> = [];

      // Previous month days
      const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      const daysInPrevMonth = getDaysInMonth(prevMonth);
      
      for (let i = startDate - 1; i >= 0; i--) {
        const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i);
        days.push({
          date,
          isCurrentMonth: false,
          isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
          isToday: isToday(date),
          isDisabled: (minDate && date < minDate) || (maxDate && date > maxDate) || false,
        });
      }

      // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        days.push({
          date,
          isCurrentMonth: true,
          isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
          isToday: isToday(date),
          isDisabled: (minDate && date < minDate) || (maxDate && date > maxDate) || false,
        });
      }

      // Next month days to fill the grid
      const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
      const remainingDays = 42 - days.length; // 6 weeks * 7 days
      
      for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);
        days.push({
          date,
          isCurrentMonth: false,
          isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
          isToday: isToday(date),
          isDisabled: (minDate && date < minDate) || (maxDate && date > maxDate) || false,
        });
      }

      return days;
    };

    // Day names based on locale and week start
    const getDayNames = () => {
      const baseDate = new Date(2023, 0, 1); // January 1, 2023 (Sunday)
      const dayNames = [];
      
      for (let i = 0; i < 7; i++) {
        const dayIndex = (weekStartsOn + i) % 7;
        const date = new Date(baseDate);
        date.setDate(date.getDate() + dayIndex);
        dayNames.push(date.toLocaleDateString(locale, { weekday: 'short' }));
      }
      
      return dayNames;
    };

    const calendarDays = generateCalendarDays();
    const dayNames = getDayNames();

    return (
      <CalendarContainer ref={ref} {...props}>
        {/* Header */}
        <CalendarHeader>
          <CalendarNavButton onPress={goToPreviousMonth} onClick={goToPreviousMonth}>
            <ChevronLeftIcon />
          </CalendarNavButton>
          
          <CalendarTitle>
            {formatMonthYear(currentMonth, locale)}
          </CalendarTitle>
          
          <CalendarNavButton onPress={goToNextMonth} onClick={goToNextMonth}>
            <ChevronRightIcon />
          </CalendarNavButton>
        </CalendarHeader>

        {/* Calendar Grid */}
        <CalendarGrid>
          {/* Day headers */}
          {dayNames.map((dayName, index) => (
            <CalendarDayHeader key={`header-${index}`}>
              {dayName}
            </CalendarDayHeader>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <CalendarDayCell
              key={`day-${index}`}
              selected={day.isSelected}
              today={day.isToday}
              outside={!day.isCurrentMonth}
              disabled={day.isDisabled}
              onPress={() => handleDateSelect(day.date)}
              onClick={() => handleDateSelect(day.date)}
            >
              {day.date.getDate()}
            </CalendarDayCell>
          ))}
        </CalendarGrid>
      </CalendarContainer>
    );
  }
);

Calendar.displayName = "Calendar";

export default Calendar;
