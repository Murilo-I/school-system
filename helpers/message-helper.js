export const success = 'alert-success';
export const danger = 'alert-danger';
export const info = 'alert-info';

const types = [success, danger, info];

export function getMessage(req) {
    let message;
    types.forEach(type => {
        let flash = req.flash(type);
        if (Array.isArray(flash) && flash.length > 0) {
            message = { text: flash[0], type: type };
        }
    });
    return message;
}