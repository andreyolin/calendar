/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { dayCell } from '../../types/dayCell';
import { dayEvent } from '../../types/dayEvent';
import { getAll } from '../../api/api';

interface Props {
  day: dayCell,
  currentMonth: number,
  onSetCurrentEvent: Dispatch<SetStateAction<dayEvent | undefined>>
  onSetFormIsShowing: Dispatch<SetStateAction<boolean>>
}

export const Day: React.FC<Props> = ({
  day, currentMonth, onSetCurrentEvent, onSetFormIsShowing,
}) => {
  const {
    numberOfDay, dayOfWeek, month,
  } = day;

  const getDayEventsFromServer = () => {
    const dayEvents: dayEvent[] = getAll();

    return dayEvents;
  };

  const dayEvents = getDayEventsFromServer();

  const currentEvents = dayEvents.filter(event => day.id === event.dayId);

  return (
    <div className="cell__content">
      <div className={cn(
        'cell__description',
        { 'cell__description--grey': Number(month) !== currentMonth },
      )}
      >
        <p>{numberOfDay}</p>
        <p>{dayOfWeek}</p>
      </div>

      <div className="cell__content__events">
        {currentEvents.map(event => (
          <span
            key={event.id}
            onClick={() => {
              onSetFormIsShowing(true);
              onSetCurrentEvent(event);
            }}
          >
            {event.title}
          </span>
        ))}
      </div>
    </div>
  );
};
