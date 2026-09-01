#!/bin/bash
# Navegar a la carpeta donde está este script
cd "$(dirname "$0")"

echo "=============================================="
echo "Iniciando English Practice App..."
echo "=============================================="
echo ""
echo "Presiona CTRL+C en esta ventana para apagar el servidor cuando termines."

# Abrir el navegador por defecto en Mac
open http://localhost:8000

# Iniciar el servidor con python3 (por defecto en Mac)
python3 -m http.server 8000
