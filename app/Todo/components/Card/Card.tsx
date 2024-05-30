import TodoItem from '~/Todo/types/Item';
import { useState } from 'react';
import { useFetcher } from '@remix-run/react';
import TodoCardDelete from './Delete';
import TodoCardCheck from './Check';
import TodoCardEdit from './Edit';

// props
interface Props {
  todo: TodoItem;
}

/**
 * Todo card component.
 */
export default function TodoCard({ todo }: Props) {
  const { id } = todo;
  const [editingActive, setEditingActive] = useState(false);
  const checkFetcher = useFetcher();
  const checkLoading = ['loading', 'submitting'].includes(checkFetcher.state);
  const updateFetcher = useFetcher();
  const updateLoading = ['loading', 'submitting'].includes(updateFetcher.state);
  const deleteFetcher = useFetcher();
  const deleteLoading = ['loading', 'submitting'].includes(deleteFetcher.state);
  const loading = checkLoading || updateLoading || deleteLoading;

  function handleCheckToggle(_done: boolean) {
    if (loading) {
      return;
    }
    checkFetcher.submit(
      {
        done: _done,
      },
      { action: `update/${id}`, method: 'POST' },
    );
  }

  function handleEdit(_label: string) {
    if (loading) {
      return;
    }
    setEditingActive(false);
    updateFetcher.submit(
      {
        label: _label,
      },
      { action: `update/${id}`, method: 'POST' },
    );
  }

  function handleDelete() {
    if (loading) {
      return;
    }
    deleteFetcher.submit(
      {},
      {
        action: `delete/${id}`,
        method: 'POST',
      },
    );
  }

  return editingActive ? (
    <TodoCardEdit
      todo={todo}
      disabled={loading}
      onDeactivate={() => setEditingActive(false)}
      onEdit={handleEdit}
    />
  ) : (
    <TodoCardCheck
      todo={todo}
      deleteElement={
        <TodoCardDelete disabled={loading} onDelete={handleDelete} />
      }
      onEditClick={() => setEditingActive(true)}
      // disabled={loading}
      onCheckToggle={handleCheckToggle}
    />
  );
}
