const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataPath = path.join(__dirname, 'public', 'movirent.json');
const getData = () => JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

app.get('/movirent/api/', (req, res) => {
    const data = getData();
    res.json(data);
});

app.get('/movirent/api/user/:id/', (req, res)=>{
   const data = getData();
   const user = data.users.find(u=>u.id === parseInt(req.params.id));
   if(user){
       res.json(user);
   } else{
       res.status(404).send('User not found');
   }
});

app.get('/movirent/api/user/:id/subscribe/', (req, res) => {
   const data = getData();
   const reservations = data.reservations.filter(r => r.client_id === parseInt(req.params.id));
   res.json(reservations);
});

app.get('movirent/api/user/:id/published_scooters/', (req, res)=>{
    const data= getData();
    const scooters = data.scooters.filter(s => s.owner_id===req.params.id);
    res.json(scooters);
});

app.get('/movirent/api/user/:id/reservations/', (req, res)=>{
    const data = getData();
    const reservations = data.reservations.filter(r => r.client_id === parseInt((req.params.id)));
    res.json(reservations);
})

app.post('/movirent/api/user/:id/subscribe/', (req, res)=>{
    const data = getDta();
    const user = data.users.find(u => u.id ===parseInt(req.params.id));
    if(user){
        const newSubscription = {
                id: data.subscriptions.leghth + 1,
                price: req.body.price,
                subscription_types_id: req.body.subscription_types_id,
                user_id: user.id,
                created_date: new Date().toISOString().split('T')[0]
        };
        data.subscriptions.push(newSubscription);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        res.status(201).json(newSubscription);
    }else{
        res.status(404).send('User not found');
    }
});

app.post('/movirent/api/user/:id/review/', (req, res)=>{
  const data= getData();
  const user = data.users.find(u => u.id ===parseInt(req.params.id));
  if(user){
      const newReview = {
          id: data.rates.length + 1,
          comment: req.body.comment,
          star_numb: req.body.star_numb,
          client_id: user.id,
          scooter_id: req.body.scooter_id
      };
      data.rates.push(newReview);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      res.status(201).json(newReview);
  }else{
      res.status(404).send('User not found');
  }
})

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);

})