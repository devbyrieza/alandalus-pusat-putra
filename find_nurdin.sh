#!/bin/bash
echo "== PPDB PUTRA (coolify-db) =="
docker exec coolify-db psql -U coolify -d ppdb_putra -c "SELECT username, full_name, phone, role FROM profiles WHERE full_name ILIKE '%nurdin%' OR username = 'mudir';"
echo "== PPDB PUTRI (coolify-db) =="
docker exec coolify-db psql -U coolify -d ppdb_putri -c "SELECT username, full_name, phone, role FROM profiles WHERE full_name ILIKE '%nurdin%' OR username = 'mudir';"
echo "== PPDB ALIMAM (coolify-db) =="
docker exec coolify-db psql -U coolify -d ppdb_alimam -c "SELECT username, full_name, phone, role FROM profiles WHERE full_name ILIKE '%nurdin%' OR username = 'mudir';"
echo "== SIMPEG (ucso0wo8gg8owc880w8sco44) =="
docker exec ucso0wo8gg8owc880w8sco44 psql -U user_office -d postgres -c "SELECT username, full_name, phone, role FROM office.profiles WHERE full_name ILIKE '%nurdin%' OR username = 'mudir';"
