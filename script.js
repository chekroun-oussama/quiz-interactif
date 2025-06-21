$(document).ready(async function(){
  let questions = [];            // Liste des questions chargées
  let actuelQuestion = 0;        // Index de la question actuelle
  let correctAnswers = 0;        // Nombre de bonnes réponses
  let score = 0;                 // Score total de l'utilisateur
  let intervalID;                // ID de l'intervalle pour le timer

  let categore=new URLSearchParams(window.location.search).get('cat'); // Récupère la valeur de la catégorie choisie depuis l'URL
  
  try {
    const res = await fetch("questions.json"); // Charger le fichier JSON
    const data = await res.json(); // Convertir en objet JS
    questions = data[categore]; // Récupérer les questions de la catégorie
  } catch (error) {
    console.error("Erreur lors du chargement du fichier JSON:", error);
  }
  
  afficheQustion();// Afficher la question

  $('#next-btn').click(function(){//passe a la question suivant
    if(actuelQuestion < questions.length - 1){
      $('#next-btn').addClass('disabled')//disactiver le button next 
      $('.choice').removeClass('disabled')//active click sur les choice
      actuelQuestion++;
      afficheQustion();
    }else{
      // Afficher les résultats quand on arrive à la dernière question
      afficherResultats();
    }
      
      })
  //les click sur les choises
  $('#choices').on('click','.choice',function(){
      clearInterval(intervalID);// Arrêter le minuteur
      $('.choice').addClass('disabled')//disactiver le click sur les choix
      $('#next-btn').removeClass('disabled')//activer le button :pour acceder a la question suivant
      if($(this).text()===questions[actuelQuestion].correct){//
          $(this).css('background-color','#6ee7b7')
          score+=10;
          correctAnswers++;
        }
      else{
        $(this).css('background-color','#fca5a5')
        score=Math.max(0,score-5); //diminue le score par 5 jusqua 0   
      }
      $('#score').text(`Score : ${score}`)// Mettre à jour l'affichage
  })

  function afficheQustion(){
    time(); // Démarre le minuteur
    $('#question').text(actuelQuestion+1+". "+questions[actuelQuestion].question)//ajouter le question
    $('#choices').html('')//vider les choix précédent
    for(choix of questions[actuelQuestion].options){
      $('#choices').append(`<div class="choice">${choix}</div>`)//ajouter les choix
    }
    // Mettre à jour le texte du bouton si c'est la dernière question
    if(actuelQuestion === questions.length - 1) {
      $('#next-btn').text('Voir les résultats');
    }
  }

  function time() {
    let s=30; // Temps initial en secondes
    clearInterval(intervalID);// Arrêter tout ancien minuteur
    $('#timer').text(`Temps : ${s} s`); // Afficher le temps initial
    $('#timer').css('color', '');// Réinitialiser la couleur
  intervalID=setInterval(() => { 
    s--;// Décrémenter le temps
    $('#timer').text(`Temps : ${s} s`);// Mettre à jour l'affichage
    switch(s){
      case 5:
        $('#timer').css('color','red'); // Changer la couleur à rouge à 5 secondes
        break;
      case -1: 
        score-=2; 
        $('#score').text(`Score : ${score}`)
        $('#next-btn').removeClass('disabled')// Activer le bouton "Suivant"
        $('#next-btn').click(); // Passer automatiquement à la question suivante
        break;
    }
  }, 1000);// Répéter chaque seconde
}

  function afficherResultats() {
    $('.quiz-container').hide();// Masquer le contenu du quiz
    // Afficher les résultas
    $('#final-score').text(`Votre score : ${score}`);
    $('#note').text(`Note : ${correctAnswers}/20`);
    $('#resultat').show();
    // Gérer le clic sur le bouton "Accueil"
    $('#home-btn').click(function() {// Gérer le bouton de retour
      window.location.href = 'index.html#category'; // Rediriger vers la page d'accueil
    });
    // Gérer le clic sur "Voir les réponses"
    $('#voir-reponses-btn').click(function(){
      $('.quiz-container').show(); // Réafficher le quiz
      $('#resultat').hide(); // Cacher les résultats
      affQRep();// Afficher les bonnes réponses
    })
  }

  function affQRep() {//affiche la liste des questions avec les bone reponse
    $('.quiz-container').html('')// Vider le contenu existant
    for(let i=0 ;i<questions.length;i++){
      // Afficher la question
      $('.quiz-container').append(`
        <div id="question" class="question"><strong>${i+1}.</strong> ${questions[i].question}</div>
        <div id="choices${i}" class="choices"></div>
      `)
      // Afficher les options avec mise en évidence de la bonne réponse
       for(choix of questions[i].options){
        let iscorrect=choix === questions[i].correct;
        $(`#choices${i}`).append(`<div class="choice ${iscorrect ? 'correct' :''}">${choix}</div>`)
      }
    }
    // Colorier les bonnes réponses en vert
    $('.correct').css('background-color','#6ee7b7')
    // Bouton pour revenir aux résultats
    $('.quiz-container').append('<button id="r-btn" class="btn" >retour</button>')
    $('#r-btn').click(afficherResultats);
  }
})
