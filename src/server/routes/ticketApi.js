
// import { getTickets } from '../controllers/mongo';

export default function setTicketApi(backendServer) {
    backendServer.get('/api/tickets', (req,res) => {
        res.send([{id: 'sdfsfdsdf'}])
        //getElasticImages(function(results) {
        //    res.send({images:filterResultsBasedOnDate(results), count: results.length});
        //});
    });

}
