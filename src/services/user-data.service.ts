import { Types } from 'mongoose';
import * as XLSX from 'xlsx';

export const uploadUserData = ( eventId: Types.ObjectId, file: Buffer ) => {
    const workbook = XLSX.read(file);
    const worksheet = workbook.Sheets['User Data'];
    const errors = [];
    if(!worksheet){
        throw Error("Worksheet with name User Data doesn't exist")
    }
}