import mongoose from 'mongoose';
import { mongoHost, mongoUsername, mongoPassword, mongoDatabase } from '../appConfig'
//initializing mongodb
var mongoDB = `mongodb://${mongoHost}/${mongoDatabase}`;
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const { Ticket } = defineSchemas();
const fields = 'mediaCounter description name username byline rightsType rightsDescription red agentUri createdAt';

export function getTickets(cb) {
  Ticket.find({}, fields, function (err, tickets) {
      if (err) return [];
      return cb(tickets);
  })  
}

export function getTicket(ticketId, cb) {
  Ticket.find({_id: ticketId}, fields, function (err, tickets) {
      if (err) return [];
      return cb(tickets);
  })  
}

export function getTicketFromUsername(username, cb) {
  Ticket.find({username: username}, fields, function (err, tickets) {
      if (err) return [];
      return cb(tickets);
  }).sort({createdAt: -1}).limit(1)  
}

export function addTicket(ticketData, cb) {
  Ticket.create(ticketData, function (err, result) {
      console.log('err', err);
      return cb(result);
    });
}

export function editTicket(ticketId, ticketData, cb) {
  Ticket.updateOne({_id: ticketId}, ticketData,{}, function (err, result) {
      return cb(result);
    });
}

export function deleteTicket(ticketId, cb) {
  Ticket.deleteOne({_id: ticketId}, function (err, result) {
      return cb(result);
    });
}

export function incrementMediaOnTicket(id, cb) {
  Ticket.updateOne({_id: id}, { $inc: { mediaCounter: 1 } },{}, function (err, result) {
      console.log('error', err);
      return cb(result);
    });
}

function defineSchemas() {
  //Define schemas
  const Schema = mongoose.Schema;

  const TicketSchema = new Schema({
      description: String,
      name: String,
      username: String,
      byline: String,
      red: Boolean,
      rightsType: String,
      rightsDescription: String,
      createdAt: Date,
      agentUri: String,
      mediaCounter: {type:Number, default:0},
  });

  return {
      Ticket:  mongoose.model('Ticket', TicketSchema),
  }
}