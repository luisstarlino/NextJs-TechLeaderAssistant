'use client';

import {
  Firestore,
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import type { Task } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Adds a new task to a user's task list in Firestore.
 * This is a non-blocking operation.
 *
 * @param db The Firestore instance.
 * @param userId The ID of the user.
 * @param taskData The task data to add (without id and 'Última Atualização').
 */
export function addTask(
  db: Firestore,
  userId: string,
  taskData: Omit<Task, 'id' | 'Última Atualização'>
): void {
  if (!userId || !db) {
    // This case should ideally be handled by UI logic (e.g., disabling buttons)
    // but we'll log an error just in case.
    console.error('User not authenticated or Firestore not available.');
    return;
  }

  const tasksCollectionRef = collection(db, `users/${userId}/tasks`);
  const dataWithTimestamp = {
    ...taskData,
    'Última Atualização': serverTimestamp(),
  };

  addDoc(tasksCollectionRef, dataWithTimestamp).catch(async (serverError) => {
    console.error('Firestore error when adding task:', serverError);
    const permissionError = new FirestorePermissionError({
      path: tasksCollectionRef.path,
      operation: 'create',
      requestResourceData: dataWithTimestamp,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

/**
 * Updates the status of an existing task in Firestore.
 * This is a non-blocking operation.
 *
 * @param db The Firestore instance.
 * @param userId The ID of the user who owns the task.
 * @param taskId The ID of the task to update.
 * @param newStatus The new status to set for the task.
 */
export function updateTaskStatus(
  db: Firestore,
  userId: string,
  taskId: string,
  newStatus: string
): void {
  if (!userId || !taskId || !db) {
    console.error(
      'User ID, Task ID, or Firestore instance is missing for update.'
    );
    return;
  }

  const taskDocRef = doc(db, `users/${userId}/tasks/${taskId}`);
  const dataToUpdate = {
    Status: newStatus,
    'Última Atualização': serverTimestamp(),
  };

  updateDoc(taskDocRef, dataToUpdate).catch(async (serverError) => {
    console.error('Firestore error when updating task:', serverError);
    const permissionError = new FirestorePermissionError({
      path: taskDocRef.path,
      operation: 'update',
      requestResourceData: dataToUpdate,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}
