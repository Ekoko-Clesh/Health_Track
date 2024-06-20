// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const { post } = require("axios"); // Importa o diretório models para carregar os modelos definidos
const hercai = require('hercai');

const app = express();
app.use(cors()); // Adiciona suporte ao CORS
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Sincronizar modelos com o banco de dados
db.sequelize.sync().then(() => {
  console.log('Database synced');
}).catch(error => {
  console.error('Error syncing database:', error);
});

// Rota para criar um novo usuário
app.post('/users', async (req, res) => {
  try {
    console.log('Recebendo requisição:', req.body); // Log para verificar os dados recebidos
    const user = await db.User.create(req.body);
    console.log('Usuário criado:', user); // Log para verificar o usuário criado
    res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error); // Log para verificar erros
    res.status(400).json({ error: 'Erro ao criar usuário' });
  }
});

// Rota para obter todos os usuários
app.get('/users', async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Erro ao obter usuários:', error); // Log para verificar erros
    res.status(500).json({ error: 'Erro ao obter usuários' });
  }
});

// Rota para obter todos os pacientes
app.get('/patients', async (req, res) => {
  try {
    const patients = await db.User.findAll({
      where: { userType: 'Paciente' }
    });
    res.json(patients);
  } catch (error) {
    console.error('Erro ao obter pacientes:', error); // Log para verificar erros
    res.status(500).json({ error: 'Erro ao obter pacientes' });
  }
});

// Rota para obter todos os médicos
app.get('/doctors', async (req, res) => {
  try {
    const users = await db.User.findAll({
      where: { userType: 'Médico' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter médicos' });
  }
});

// Rota para login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    res.json({ message: 'Login bem-sucedido', user });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para atualizar um usuário
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await db.User.update(req.body, {
      where: { id: id }
    });

    if (updated) {
      const updatedUser = await db.User.findOne({ where: { id: id } });
      res.status(200).json(updatedUser);
    } else {
      throw new Error('Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error); // Log para verificar erros
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Rota para criar um agendamento
app.post('/appointments', async (req, res) => {
  const { doctorId, patientId, date } = req.body;
  if (!doctorId || !patientId || !date) {
    return res.status(400).json({ error: 'Os campos doctorId, patientId e date são obrigatórios.' });
  }

  try {
    const appointment = await db.Appointment.create({
      doctorId,
      patientId,
      date,
      status: 'pendente'
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento.' });
  }
});

// Rota para obter todos os agendamentos de um paciente específico
app.get('/appointments', async (req, res) => {
  const { patientId } = req.query;
  if (!patientId) {
    return res.status(400).json({ error: 'O campo patientId é obrigatório.' });
  }

  try {
    const appointments = await db.Appointment.findAll({
      where: { patientId },
      include: [
        {
          model: db.User,
          as: 'Doctor',
          attributes: ['name'],
        },
      ],
    });

    res.json(appointments);
  } catch (error) {
    console.error('Erro ao obter agendamentos:', error);
    res.status(400).json({ error: 'Erro ao obter agendamentos' });
  }
});

// Rota para atualizar um agendamento
app.put('/appointments/:id', async (req, res) => {
  try {
    const appointment = await db.Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    await appointment.update(req.body);
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar agendamento' });
  }
});

// Rota para deletar um agendamento
app.delete('/appointments/:id', async (req, res) => {
  try {
    const appointment = await db.Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    await appointment.destroy();
    res.json({ message: 'Agendamento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    res.status(500).json({ error: 'Erro ao deletar agendamento' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
