const $ = require("jquery");
$.DataTable = require("datatables.net");


export const displayDataTable = (ref, data, columns, options = {}) => {
    const mytable = $(ref);
        mytable.DataTable({
            data,
            columns,
            ...options
        })
}

export const destroyDataTable = (ref) => {
    const mytable = $(ref);
    mytable.DataTable().destroy();
}