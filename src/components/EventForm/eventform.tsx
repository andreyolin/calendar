import moment from 'moment';
import React, {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import uuid from 'react-uuid';
import { addOne, deleteOne, updateOne } from '../../api/api';
import { dayCell } from '../../types/dayCell';
import { dayEvent } from '../../types/dayEvent';

interface Props {
  onSetFormIsShowing: Dispatch<SetStateAction<boolean>>
  choosenDay?: dayCell | null
  currentEvent?: dayEvent
}

export const EventForm: React.FC<Props> = ({ onSetFormIsShowing, choosenDay, currentEvent }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(choosenDay?.date);
  const [time, setTime] = useState('');

  const handleSubmit = () => {
    const newEvent = {
      createdAt: moment().format('HH:mm d MMMM YYYY'),
      id: uuid(),
      dayId: choosenDay?.id,
      title,
      description,
      date,
      time,
    };

    if (!currentEvent) {
      addOne(newEvent);
    } else {
      updateOne({
        id: currentEvent?.id,
        title,
        date,
        time,
        dayId: choosenDay?.id,
        description,
      });
    }

    onSetFormIsShowing(false);
  };

  const setDataOfEvent = () => {
    if (currentEvent) {
      setTitle(currentEvent.title);

      if (currentEvent.description) {
        setDescription(currentEvent.description);
      }

      if (currentEvent.time) {
        setTime(currentEvent.time);
      }

      setDate(currentEvent.date);
    }
  };

  useEffect(() => {
    setDataOfEvent();
  }, [choosenDay]);

  return (
    <form className="eventForm">
      <div className="eventForm__title">
        <h2 className="eventForm__text">Add new event</h2>

        <button
          className="eventForm__title__button"
          type="button"
          onClick={() => onSetFormIsShowing(false)}
        >
          X
        </button>
      </div>

      <h3>Title*</h3>

      {currentEvent && (
        <p>{`Created at ${currentEvent?.createdAt}`}</p>
      )}

      <input
        className="eventForm__titleInput"
        required
        type="text"
        placeholder="Title goes here"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <input
        type="text"
        className="eventForm__descriptionInput"
        placeholder="description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <div className="eventForm__dateInputs">
        <input
          type="date"
          required
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={!title || !date}
        onClick={handleSubmit}
      >
        Save
      </button>

      {currentEvent && (
        <button
          type="submit"
          onClick={() => deleteOne(currentEvent?.id)}
        >
          Delete
        </button>
      )}
    </form>
  );
};
