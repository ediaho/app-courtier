// components/CourtierApp.js
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, deleteDoc, getDocs, doc } from "firebase/firestore";

export default function CourtierApp() {
  const [clients, setClients] = useState([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [echeance, setEcheance] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setClients(data);
    };
    fetchClients();
  }, []);

  const ajouterClient = async () => {
    if (!nom) return alert("Nom requis");
    const newClient = { nom, email, note, echeance };
    const docRef = await addDoc(collection(db, "clients"), newClient);
    setClients([...clients, { id: docRef.id, ...newClient }]);
    setNom(""); setEmail(""); setNote(""); setEcheance("");
  };

  const supprimerClient = async (id) => {
    await deleteDoc(doc(db, "clients", id));
    setClients(clients.filter(c => c.id !== id));
  };

  const verifierAlertes = (dateEcheance) => {
    if (!dateEcheance) return false;
    const diff = new Date(dateEcheance) - new Date();
    return diff < 7 * 24 * 60 * 60 * 1000 && diff > 0;
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Gestion Clients - Courtier</h1>

      <section style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, marginBottom: 20 }}>
        <h2>Ajouter un client</h2>
        <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} />
        <input type="date" value={echeance} onChange={e => setEcheance(e.target.value)} style={{ padding: 8, marginBottom: 8 }} />
        <textarea placeholder="Notes" value={note} onChange={e => setNote(e.target.value)} style={{ width: "100%", padding: 8, minHeight: 80 }} />
        <button onClick={ajouterClient} style={{ marginTop: 10, padding: "10px 16px" }}>Ajouter</button>
      </section>

      <section>
        {clients.length === 0 ? <p style={{ textAlign: "center", color: "#666" }}>Aucun client pour le moment.</p> : (
          clients.map(c => (
            <div key={c.id} style={{
              border: verifierAlertes(c.echeance) ? "2px solid #e74c3c" : "1px solid #ddd",
              padding: 12, borderRadius: 8, marginBottom: 10, display: "flex", justifyContent: "space-between"
            }}>
              <div>
                <strong style={{ fontSize: 16 }}>{c.nom} {verifierAlertes(c.echeance) && <span style={{ color: "#e74c3c", marginLeft: 8 }}>🔔 Échéance proche</span>}</strong>
                {c.email && <div>📧 {c.email}</div>}
                {c.echeance && <div>📅 Échéance : {c.echeance}</div>}
                {c.note && <div>📝 {c.note}</div>}
              </div>
              <div>
                <button onClick={() => supprimerClient(c.id)} style={{ background: "#ff4d4f", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 6 }}>Supprimer</button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
