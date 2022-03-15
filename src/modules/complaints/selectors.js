import flow from 'lodash/fp/flow';
import { STATE_REDUCER_KEY } from './constants';

export const getComplaint = state => state[STATE_REDUCER_KEY];

const incompleteComplaints = complaint => complaint.incompleteComplaints;
export const getIncompleteComplaints = flow(getComplaint, incompleteComplaints);

const doneComplaints = complaint => complaint.doneComplaints;
export const getDoneComplaints = flow(getComplaint, doneComplaints);

const newComplaint = complaint => complaint.newComplaint;
export const getNewComplaint = flow(getComplaint, newComplaint);

const complaints = complaint => complaint.complaints;
export const getComplaints = flow(getComplaint, complaints);

const allComplaints = complaint => complaint.allComplaints;
export const getAllComplaints = flow(getComplaint, allComplaints);

const complaintItemList = complaint => complaint.complaintItemList;
export const getComplaintItemList = flow(getComplaint, complaintItemList);

const icons = complaint => complaint.icons;
export const getComplaintIcons = flow(getComplaint, icons);

const photos = complaint => complaint.photos;
export const getComplaintPhotos = flow(getComplaint, photos);
