import { IonButton, IonCol, IonGrid, IonRow } from '@ionic/react';
import React, { Dispatch, SetStateAction } from 'react';

type DayOfMonthSelectionProps = {
  everyDaysOfMonthValue: number[] | undefined;
  setEveryDaysOfMonthValue: Dispatch<SetStateAction<number[] | undefined>>;
};

const DayOfMonthSelection: React.FC<DayOfMonthSelectionProps> = ({
  everyDaysOfMonthValue,
  setEveryDaysOfMonthValue,
}) => {
  const days = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, 31, -1, -1, -1, -1],
  ];

  return (
    <IonGrid className="days-of-month-selection">
      {days.map((row, index) => (
        <IonRow key={index}>
          {row.map((day) => {
            if (day === -1) return <IonCol></IonCol>;
            else
              return (
                <IonCol key={day}>
                  <IonButton
                    onClick={() => {
                      setEveryDaysOfMonthValue((prev: number[] | undefined) => {
                        let newPrev = prev ? [...prev] : [];
                        if (newPrev.includes(day)) newPrev = newPrev.filter((d) => d !== day);
                        else newPrev.push(day);
                        return newPrev;
                      });
                    }}
                    fill={everyDaysOfMonthValue?.includes(day) ? 'solid' : 'clear'}
                  >
                    {day}
                  </IonButton>
                </IonCol>
              );
          })}
        </IonRow>
      ))}
    </IonGrid>
  );
};

export default DayOfMonthSelection;
