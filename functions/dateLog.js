module.exports = { dateLog }

function dateLog() {
    var date = new Date();

    let jour = ("0" + date.getDate()).slice(-2);
    let mois = ("0" + (date.getMonth() + 1)).slice(-2);
    var annee = date.getFullYear();
    var heure = ("0"+ date.getHours()).slice(-2);
    var minute = ("0"+ date.getMinutes()).slice(-2);
    
    var dateToLog = `[${jour}/${mois}-${heure}:${minute}]`

    return dateToLog;
};
