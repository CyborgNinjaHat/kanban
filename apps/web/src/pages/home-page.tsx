import { useNavigate } from 'react-router';
import { BoardAccess } from '@/features/board-access/components/board-access';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-svh place-items-center p-6">
      <BoardAccess
        onBoardSelected={(boardId) => {
          void navigate(`/boards/${boardId}`);
        }}
      />
    </main>
  );
};
