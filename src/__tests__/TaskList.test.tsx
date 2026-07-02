import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskList } from '../components/TaskList';
import type { Task } from '../types/task';

const mockTasks: Task[] = [
	{
		id: 1,
		title: 'Premiere tache',
		description: 'Description 1',
		completed: false,
		createdAt: '2026-01-15T10:00:00Z',
		updatedAt: '2026-01-15T10:00:00Z',
	},
	{
		id: 2,
		title: 'Deuxieme tache',
		description: null,
		completed: true,
		createdAt: '2026-01-16T10:00:00Z',
		updatedAt: '2026-01-16T10:00:00Z',
	},
];

describe('TaskList', () => {
	it('shows loading state', () => {
		render(
			<TaskList
				tasks={[]}
				loading={true}
				error={null}
				onToggle={vi.fn()}
				onDelete={vi.fn()}
				onEdit={vi.fn()}
			/>
		);
		expect(screen.getByTestId('loading')).toBeInTheDocument();
	});

	it('shows error state', () => {
		render(
			<TaskList
				tasks={[]}
				loading={false}
				error="Something went wrong"
				onToggle={vi.fn()}
				onDelete={vi.fn()}
				onEdit={vi.fn()}
			/>
		);
		expect(screen.getByTestId('error')).toBeInTheDocument();
		expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
	});

	it('shows empty state when there are no tasks', () => {
		render(
			<TaskList
				tasks={[]}
				loading={false}
				error={null}
				onToggle={vi.fn()}
				onDelete={vi.fn()}
				onEdit={vi.fn()}
			/>
		);
		expect(screen.getByTestId('empty')).toBeInTheDocument();
	});

	it('renders list of tasks', () => {
		render(
			<TaskList
				tasks={mockTasks}
				loading={false}
				error={null}
				onToggle={vi.fn()}
				onDelete={vi.fn()}
				onEdit={vi.fn()}
			/>
		);
		expect(screen.getByTestId('task-list')).toBeInTheDocument();
		expect(screen.getByText('Premiere tache')).toBeInTheDocument();
		expect(screen.getByText('Deuxieme tache')).toBeInTheDocument();
	});

	it('displays correct completed count', () => {
		render(
			<TaskList
				tasks={mockTasks}
				loading={false}
				error={null}
				onToggle={vi.fn()}
				onDelete={vi.fn()}
				onEdit={vi.fn()}
			/>
		);
		// 1 out of 2 tasks is completed in mockTasks
		expect(screen.getByText(/1 termin/)).toBeInTheDocument();
	});
});