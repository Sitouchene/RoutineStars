import React from 'react';
import { useToast } from './components/ui/Toast';
import { useConfirm } from './components/ui/ConfirmModal';

function TestComponents() {
  const { success, error, warning, info, ToastContainer } = useToast();
  const { confirm, ConfirmModalComponent } = useConfirm();

  const handleTestToast = () => {
    success('Test toast success!');
  };

  const handleTestConfirm = async () => {
    const confirmed = await confirm({
      title: 'Test Confirmation',
      message: 'Êtes-vous sûr ?',
      type: 'warning'
    });
    
    if (confirmed) {
      info('Confirmé !');
    } else {
      error('Annulé !');
    }
  };

  return (
    <div className="p-4">
      <h1>Test des Composants</h1>
      <button onClick={handleTestToast} className="mr-4 px-4 py-2 bg-green-500 text-white rounded">
        Test Toast
      </button>
      <button onClick={handleTestConfirm} className="px-4 py-2 bg-blue-500 text-white rounded">
        Test Confirm
      </button>
      
      <ToastContainer />
      <ConfirmModalComponent />
    </div>
  );
}

export default TestComponents;

