import { useState } from 'react';
import './Calendar.css';

const Calendar = ({ bookedDates, startDate, endDate, onSelect, onClose }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Helper to get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Helper to get day of week for first day (0-6)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const isDateBooked = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return bookedDates.some(range => {
            const start = new Date(range.start);
            start.setHours(0, 0, 0, 0);
            const end = new Date(range.end);
            end.setHours(0, 0, 0, 0);
            return d >= start && d < end;
        });
    };

    const isDateBeforeToday = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const handleDayClick = (day) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

        if (isDateBooked(date) || isDateBeforeToday(date)) return;

        if (!startDate || (startDate && endDate)) {
            onSelect({ start: date, end: null });
        } else {
            // Selecting end date
            if (date < startDate) {
                // If clicked date is before start date, make it the new start date
                onSelect({ start: date, end: null });
            } else {
                // Check if there are booked dates in between
                let conflict = false;
                let temp = new Date(startDate);
                while (temp < date) {
                    temp.setDate(temp.getDate() + 1);
                    if (isDateBooked(temp)) {
                        conflict = true;
                        break;
                    }
                }

                if (conflict) {
                    alert("No puedes seleccionar un rango que incluya fechas reservadas.");
                    return;
                }

                onSelect({ start: startDate, end: date });
            }
        }
    };

    const renderDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];

        // Empty cells for days before start of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="day-cell empty"></div>);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const isBooked = isDateBooked(date);
            const isPast = isDateBeforeToday(date);

            let className = "day-cell";
            if (isBooked) className += " booked";
            if (isPast) className += " disabled";

            if (startDate && date.getTime() === startDate.getTime()) className += " selected";
            if (endDate && date.getTime() === endDate.getTime()) className += " selected";

            if (startDate && endDate && date > startDate && date < endDate) {
                className += " in-range";
            }

            days.push(
                <div
                    key={d}
                    className={className}
                    onClick={() => handleDayClick(d)}
                >
                    {d}
                </div>
            );
        }

        return days;
    };

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return (
        <>
            <div className="calendar-overlay" onClick={onClose}></div>
            <div className="calendar-container">
                <div className="calendar-header">
                    <button className="month-nav-btn" onClick={handlePrevMonth}>&lt;</button>
                    <h3 style={{ margin: 0 }}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
                    <button className="month-nav-btn" onClick={handleNextMonth}>&gt;</button>
                </div>

                <div className="calendar-grid">
                    <div className="weekday-label">D</div>
                    <div className="weekday-label">L</div>
                    <div className="weekday-label">M</div>
                    <div className="weekday-label">M</div>
                    <div className="weekday-label">J</div>
                    <div className="weekday-label">V</div>
                    <div className="weekday-label">S</div>
                    {renderDays()}
                </div>

                <div className="calendar-footer">
                    <button className="btn-clear-dates" onClick={() => onSelect({ start: null, end: null })}>Borrar fechas</button>
                    <button className="btn-close-calendar" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </>
    );
};

export default Calendar;
