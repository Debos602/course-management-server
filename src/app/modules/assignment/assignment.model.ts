import { Schema, model } from 'mongoose';
import { IAssignment, AssignmentModel } from './assignment.interface';

const AssignmentSchema = new Schema<IAssignment, AssignmentModel>(
    {
        title: { type: String },
        description: { type: String },
        submissionLink: { type: String },
        textAnswer: { type: String },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
        lesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
        student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        submittedAt: { type: Date },
        grade: { type: Number },
        feedback: { type: String },
        attachments: [{ type: String }],
    },
    { timestamps: true },
);

AssignmentSchema.index({ course: 1, student: 1 });

export const Assignment = model<IAssignment, AssignmentModel>('Assignment', AssignmentSchema);
