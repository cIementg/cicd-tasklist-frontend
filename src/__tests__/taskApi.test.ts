import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../api/taskApi';

const mockTask = {
	id: 1,
	title: 'Test',
	description: null,
	completed: false,
	createdAt: '2026-01-15T10:00:00Z',
	updatedAt: '2026-01-15T10:00:00Z',
};

beforeEach(() => {
	vi.restoreAllMocks();
});

describe('taskApi', () => {
	it('getTasks returns array', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve([mockTask]),
			})
		);
		const tasks = await getTasks();
		expect(tasks).toEqual([mockTask]);
		expect(fetch).toHaveBeenCalledWith('/api/tasks');
	});

	it('getTask returns a single task', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockTask),
			})
		);
		const task = await getTask(1);
		expect(task).toEqual(mockTask);
		expect(fetch).toHaveBeenCalledWith('/api/tasks/1');
	});

	it('createTask sends POST request with correct body', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockTask),
			})
		);
		const payload = { title: 'Test', description: 'desc' };
		const task = await createTask(payload);
		expect(task).toEqual(mockTask);
		expect(fetch).toHaveBeenCalledWith('/api/tasks', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
	});

	it('updateTask sends PUT request with correct body', async () => {
		const updated = { ...mockTask, title: 'Updated' };
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(updated),
			})
		);
		const payload = { title: 'Updated' };
		const task = await updateTask(1, payload);
		expect(task).toEqual(updated);
		expect(fetch).toHaveBeenCalledWith('/api/tasks/1', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
	});

	it('deleteTask sends DELETE request', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
			})
		);
		await deleteTask(1);
		expect(fetch).toHaveBeenCalledWith('/api/tasks/1', {
			method: 'DELETE',
		});
	});

	it('getTasks throws an error when response is not ok', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: false,
				status: 500,
				text: () => Promise.resolve('Internal Server Error'),
			})
		);
		await expect(getTasks()).rejects.toThrow('HTTP 500');
	});

	it('deleteTask throws an error when response is not ok', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: false,
				status: 404,
				text: () => Promise.resolve('Not Found'),
			})
		);
		await expect(deleteTask(999)).rejects.toThrow('HTTP 404');
	});
});