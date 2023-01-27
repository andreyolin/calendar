import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import moment, { Moment } from 'moment';
import { Day } from '../Day';
import { dayCell } from '../../types/dayCell';
import { EventForm } from '../EventForm';
import { dayEvent } from '../../types/dayEvent';

export const Calendar: React.FC = () => {
  const [year, setYear] = useState(Number(moment().format('YYYY')));
  const [month, setMonth] = useState(Number(moment().format('M')));
  const [choosenDay, setChosenDay] = useState<dayCell | null>(null);
  const [formIsShowing, setFormIsShowing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<dayEvent>();

  const saveFilters = () => {
    const currentFilters = {
      year,
      month,
      choosenDay,
    };

    localStorage.setItem('filters', JSON.stringify(currentFilters));
  };

  const day = moment(`${year}-${month}-01`).format('D');

  moment.updateLocale('en', { week: { dow: 1 } });
  const startDay = moment(`${year}-${month}-${day}`).startOf('month').startOf('week');

  const getArrayOfDays = (start: Moment) => {
    const arrayOfDays = [];
    let countOfDays = 1;
    const currentDay = start.clone();

    while (countOfDays <= 42) {
      arrayOfDays.push(currentDay.clone());
      currentDay.add(1, 'day');
      countOfDays += 1;
    }

    return arrayOfDays.map(dayOfArray => ({
      id: moment(dayOfArray).format('D') + moment(dayOfArray).format('M') + moment(dayOfArray).format('YYYY'),
      date: `${moment(dayOfArray).format('YYYY')}-${moment(dayOfArray).format('MM')}-${moment(dayOfArray).format('DD')}`,
      numberOfDay: moment(dayOfArray).format('D'),
      dayOfWeek: moment(dayOfArray).format('dd'),
      month: moment(dayOfArray).format('M'),
      year: moment(dayOfArray).format('YYYY'),
    }));
  };

  const arrayOfDays = getArrayOfDays(moment(startDay));

  const isCurrentDay = (dayOfCell: dayCell) => {
    return moment().format('YYYY M D') === `${dayOfCell.year} ${dayOfCell.month} ${dayOfCell.numberOfDay}`;
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(currentYear => currentYear - 1);
    } else {
      setMonth(currentMonth => currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(currentYear => currentYear + 1);
    } else {
      setMonth(currentMonth => currentMonth + 1);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value.split('-');

    const idToFind = newDate.map(date => Number(date)).reverse().join('');

    const neededDay = arrayOfDays.find(dayOfArray => dayOfArray.id === idToFind) || null;

    setYear(Number(newDate[0]));
    setMonth(Number(newDate[1]));
    setChosenDay(neededDay);
  };

  useEffect(() => {
    const currentFilters = JSON.parse((localStorage.getItem('filters') || '[]'));

    setYear(currentFilters.year);
    setMonth(currentFilters.month);
    setChosenDay(currentFilters.choosenDay);
  }, []);

  useEffect(() => {
    saveFilters();
  }, [year, month, choosenDay]);

  return (
    <div className="calendar">
      <div className="calendar__header">
        <div className="calendar__header__form">
          <button
            className="calendar__header__form__button"
            type="button"
            disabled={!choosenDay}
            onClick={() => {
              setCurrentEvent(undefined);
              setFormIsShowing(!formIsShowing);
            }}
          >
            +
          </button>

          {!choosenDay && (
            <p>Please Choose a day to add event</p>
          )}
        </div>

        <div className="calendar__header__nav">
          <div className="calendar__header__nav__chooser">
            <button
              className="calendar__header__nav__chooser__button"
              type="button"
              onClick={handlePrevMonth}
            >
              {'<'}
            </button>
            <p>{`${moment(`${year}-${month}-1`).format('MMMM')} ${year}`}</p>
            <button
              className="calendar__header__nav__chooser__button"
              type="button"
              onClick={handleNextMonth}
            >
              {'>'}
            </button>
          </div>

          <input
            className="calendar__header__nav__date"
            type="date"
            value=""
            onChange={handleChange}
          />
        </div>

      </div>

      <div className="calendar__body">
        {formIsShowing && (
          <EventForm
            currentEvent={currentEvent}
            choosenDay={choosenDay}
            onSetFormIsShowing={setFormIsShowing}
          />
        )}
        {arrayOfDays.map(dayToShow => (
          <button
            type="button"
            className={cn(
              'cell',
              { cell__isCurrent: isCurrentDay(dayToShow) },
              { cell__isActive: choosenDay?.id === dayToShow.id },
              { cell__isNotCurrentMonth: Number(dayToShow.month) !== month },
            )}
            key={dayToShow.id}
            onClick={() => {
              setChosenDay(dayToShow);
              if (formIsShowing) {
                setFormIsShowing(false);
              }
            }}
          >
            <Day
              onSetFormIsShowing={setFormIsShowing}
              onSetCurrentEvent={setCurrentEvent}
              day={dayToShow}
              currentMonth={month}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
