package main

import (
	"fmt"
	"net/http"
	"net/smtp"
)

func sendReportEmailHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		// Dati del report (puoi modificare i valori per includere dettagli specifici)
		report := "Report dei Timer:\n"
		socialTime := r.FormValue("socialTime")
		webTime := r.FormValue("webTime")

		report += fmt.Sprintf("Tempo Social: %s\n", socialTime)
		report += fmt.Sprintf("Tempo Web: %s\n", webTime)

		// Configurazione dell'email
		from := "segreteria@associazionened.eu"
		password := "Segre1234X"
		to := "digitaldetox@associazionened.eu"
		subject := "Report Timer Digital Detox"
		body := fmt.Sprintf("Subject: %s\n\n%s", subject, report)

		// Configura il server SMTP
		auth := smtp.PlainAuth("", from, password, "smtps.aruba.it")
		err := smtp.SendMail("smtps.aruba.it:465", auth, from, []string{to}, []byte(body))
		if err != nil {
			http.Error(w, "Errore nell'invio del report", http.StatusInternalServerError)
			fmt.Println("Errore:", err)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Email inviata con successo!"))
	} else {
		http.Error(w, "Metodo non supportato", http.StatusMethodNotAllowed)
	}
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/send-report", sendReportEmailHandler)

	fmt.Println("Server running on http://localhost:8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
