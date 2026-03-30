(function () {
  const guessWhoLink = document.getElementById("normalHubGuessWho");

  if (guessWhoLink) {
    guessWhoLink.addEventListener("click", () => {
      sessionStorage.setItem("upro_guesswho_unlocked", "true");
    });
  }
})();
