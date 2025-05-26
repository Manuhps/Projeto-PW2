const User = require('./userModel');
const Alojamento = require('./alojamentoModel');
const Evento = require('./eventoModel');
const Reserva = require('./reservaModel');
const Inscricao = require('./inscricaoModel');

// Associações User - Evento (Organizador)
User.hasMany(Evento, { foreignKey: 'organizador_id', as: 'eventosOrganizados' });
Evento.belongsTo(User, { foreignKey: 'organizador_id', as: 'organizador' });~

// Associações User - Evento (Organizador)
User.hasMany(Evento, { foreignKey: 'proprietario_id', as: 'propriedades' });
Evento.belongsTo(User, { foreignKey: 'proprietario_id', as: 'proprietario' });

// Associações User - Reserva
User.hasMany(Reserva, { foreignKey: 'user_id', as: 'reservas' });
Reserva.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Associações Alojamento - Reserva
Alojamento.hasMany(Reserva, { foreignKey: 'alojamento_id', as: 'reservas' });
Reserva.belongsTo(Alojamento, { foreignKey: 'alojamento_id', as: 'alojamento' });

// Associações User - Inscricao
User.hasMany(Inscricao, { foreignKey: 'user_id', as: 'inscricoes' });
Inscricao.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Associações Evento - Inscricao
Evento.hasMany(Inscricao, { foreignKey: 'evento_id', as: 'inscricoes' });
Inscricao.belongsTo(Evento, { foreignKey: 'evento_id', as: 'evento' });

module.exports = {
    User,
    Alojamento,
    Evento,
    Reserva,
    Inscricao
}; 