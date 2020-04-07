
import { getTickets, addTicket, getTicket, deleteTicket, incrementMediaOnTicket, getTicketFromUsername } from '../controllers/mongo';

export default function setTicketApi(backendServer) {
    backendServer.get('/api/tickets', (req,res) => {
        getTickets(function(results) {
            res.send(results);
        });
    });

    backendServer.get('/api/tickets/:id', (req,res) => {
        getTicket(req.params.id, function(results) {
            res.send(results);
        });
    });

    backendServer.get('/api/addmedia/:id', (req,res) => {
        incrementMediaOnTicket(req.params.id, function(results) {
            res.send(results);
        });
    });
    
    backendServer.get('/api/ticketbyusername/:username', (req,res) => {
        getTicketFromUsername(req.params.username, function(results) {
            res.send(results);
        });
    })

    backendServer.delete('/api/tickets/:id', (req,res) => {
        deleteTicket(req.params.id, function(results) {
            res.send(results);
        });
    });

    backendServer.post('/api/tickets', (req,res) => {
        addTicket(req.body, function(results) {
            res.send(results);
        });
    });
}
