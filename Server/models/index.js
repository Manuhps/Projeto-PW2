const sequelize = require('../../connection');
const User = require('./userModel');
const Alojamento = require('./alojamentoModel');
const Evento = require('./eventoModel');
const Reserva = require('./reservaModel');
const Inscricao = require('./inscricaoModel');

// Definir as relações entre os modelos
User.hasMany(Alojamento, { 
    foreignKey: 'proprietario_id',
    as: 'alojamentos'
});
User.hasMany(Evento, { 
    foreignKey: 'organizador_id',
    as: 'eventosOrganizados'
});
User.hasMany(Reserva, { 
    foreignKey: 'user_id',
    as: 'reservas'
});
User.hasMany(Inscricao, { 
    foreignKey: 'user_id',
    as: 'inscricoes'
});

Alojamento.belongsTo(User, { 
    foreignKey: 'proprietario_id',
    as: 'proprietario'
});
Alojamento.hasMany(Reserva, { 
    foreignKey: 'alojamento_id',
    as: 'reservas'
});

Evento.belongsTo(User, { 
    foreignKey: 'organizador_id',
    as: 'organizador'
});
Evento.hasMany(Inscricao, { 
    foreignKey: 'evento_id',
    as: 'inscricoes'
});

Reserva.belongsTo(User, { 
    foreignKey: 'user_id',
    as: 'usuario'
});
Reserva.belongsTo(Alojamento, { 
    foreignKey: 'alojamento_id',
    as: 'alojamento'
});

Inscricao.belongsTo(User, { 
    foreignKey: 'user_id',
    as: 'usuario'
});
Inscricao.belongsTo(Evento, { 
    foreignKey: 'evento_id',
    as: 'evento'
});

module.exports = {
    sequelize,
    User,
    Alojamento,
    Evento,
    Reserva,
    Inscricao
}; 