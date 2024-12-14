import { IonModal } from '@ionic/react';
import React from 'react';

type SortOptionsModalProps = { triggerId: string };

const SortOptionsModal: React.FC<SortOptionsModalProps> = ({ triggerId }) => {
  return (
    <IonModal trigger={triggerId} initialBreakpoint={1} breakpoints={[0, 1]}>
      <div>{triggerId} sorting and grouping</div>
    </IonModal>
  );
};

export default SortOptionsModal;
