module.exports = function() {
    var date = new Date();

    let jour = ("0" + date.getDate()).slice(-2);
    let mois = ("0" + (date.getMonth() + 1)).slice(-2);
    var annee = date.getFullYear();
    var heure = date.getHours();
    var minute = date.getMinutes();
    
    var dateToLog = `[${jour}/${mois}-${heure}:${minute}]`

    return dateToLog;
    
};
