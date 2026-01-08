import { useEffect, useMemo, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createItem, deleteItem, getItems, updateBought } from "./api";
import type { ShoppingItem } from "./types";

export default function App() {
  // Zustandsverwaltung
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputError, setInputError] = useState(false);
  const [shake, setShake] = useState(false);

  // Anzahl nicht gekaufter Artikel
  const remainingCount = useMemo(
    () => items.filter((i) => !i.bought).length,
    [items]
  );

  // Initiales Laden der Einkaufsliste beim Mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getItems();
        if (!cancelled) setItems(data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Fehler beim Laden");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Neues Produkt zur Liste hinzufügen
  async function onAdd() {
    const trimmed = name.trim();
    if (!trimmed) {
      setInputError(true);
      setShake(true);
      setTimeout(() => setShake(false), 200);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const created = await createItem(trimmed);
      setItems((prev) => [created, ...prev]);
      setName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler beim Hinzufügen");
    } finally {
      setSubmitting(false);
    }
  }

  // Status umschalten
  async function onToggle(item: ShoppingItem) {
    const nextBought = !item.bought;

    // Optimistic UI Update
    setItems((prev) =>
      prev.map((i) => (i._id === item._id ? { ...i, bought: nextBought } : i))
    );

    try {
      await updateBought(item._id, nextBought);
    } catch (e) {
      // rollback - falls fehlerhaft
      setItems((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, bought: item.bought } : i
        )
      );
      setError(e instanceof Error ? e.message : "Fehler beim Aktualisieren");
    }
  }

  // Eintrag löschen
  async function onDelete(id: string) {
    const before = items;
    setItems((prev) => prev.filter((i) => i._id !== id));

    try {
      await deleteItem(id);
    } catch (e) {
       // rollback - falls fehlerhaft
      setItems(before);
      setError(e instanceof Error ? e.message : "Fehler beim Löschen");
    }
  }

  // UI Rendern
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Einkaufsliste
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {remainingCount} offen • {items.length} gesamt
          </Typography>
        </Box>

        <Paper
          variant="outlined"
          sx={{ p: 2, borderColor: "divider", borderRadius: 2 }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems="stretch"
          >
            <TextField
              label="Produkt eingeben"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (inputError && e.target.value.trim()) setInputError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") void onAdd();
              }}
              placeholder="z. B. Butter"
              fullWidth
              disabled={submitting}
              variant="outlined"
              error={inputError}
              helperText={
                inputError ? "Bitte Produktnamen eingeben" : undefined
              }
              sx={{
                animation: shake ? "shake 200ms ease-in-out" : undefined,
                "@keyframes shake": {
                  "0%": { transform: "translateX(0)" },
                  "25%": { transform: "translateX(-2px)" },
                  "50%": { transform: "translateX(2px)" },
                  "75%": { transform: "translateX(-1px)" },
                  "100%": { transform: "translateX(0)" },
                },
                "& .MuiOutlinedInput-root": {
                  transition: "border-color 150ms, box-shadow 150ms",
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.light" },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: "2px",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => void onAdd()}
              disabled={submitting || !name.trim()}
              startIcon={<AddIcon />}
              aria-busy={submitting}
              sx={{
                alignSelf: "stretch",
                minWidth: { sm: 180 },
                px: 2.5,
                flexShrink: 0,
              }}
            >
              {submitting ? "Hinzufügen…" : "Hinzufügen"}
            </Button>
          </Stack>
        </Paper>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Paper
          variant="outlined"
          sx={{ p: 1, borderColor: "divider", borderRadius: 2 }}
        >
          {loading ? (
            <Box sx={{ p: 2 }}>
              <Typography color="text.secondary">Lade…</Typography>
            </Box>
          ) : items.length === 0 ? (
            <Box sx={{ p: 2 }}>
              <Typography color="text.secondary">
                Noch keine Produkte – füge dein erstes hinzu 🛒
              </Typography>
            </Box>
          ) : (
            <List dense disablePadding>
              {items.map((item) => (
                <ListItem
                  key={item._id}
                  disablePadding
                  sx={{
                    animation: "fadeIn 150ms ease-out",
                    "@keyframes fadeIn": {
                      from: { opacity: 0, transform: "translateY(6px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                  secondaryAction={
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="löschen"
                        onClick={() => void onDelete(item._id)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  }
                >
                  <ListItemButton
                    onClick={() => void onToggle(item)}
                    sx={{
                      py: 0.5,
                      alignItems: "center",
                      transition: "background-color 150ms, opacity 150ms",
                      bgcolor: item.bought ? "action.hover" : "transparent",
                      opacity: item.bought ? 0.7 : 1,
                    }}
                  >
                    <Checkbox
                      checked={item.bought}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        transition: "transform 150ms",
                        "&.Mui-checked": { transform: "scale(1.05)" },
                      }}
                    />
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        sx: {
                          textDecoration: item.bought ? "line-through" : "none",
                          color: item.bought
                            ? "text.secondary"
                            : "text.primary",
                          transition:
                            "color 150ms, text-decoration-color 150ms",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <Typography variant="caption" color="text.secondary">
          Tipp: Klicke auf einen Eintrag, um ihn abzuhaken.
        </Typography>
      </Stack>
    </Container>
  );
}
