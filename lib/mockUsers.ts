export const mockUsers = {
    teacher: {
        id: 'teacher1',
        name: 'John',
        role: 'teacher',
    },
    student: {
        id: 'student1',
        name: 'Jane',
        role: 'student',
    },
};

export function getCurrentUser() {
    return mockUsers.teacher;
}