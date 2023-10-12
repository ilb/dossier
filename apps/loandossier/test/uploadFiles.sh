echo "Upload file to dossier from test directory"
curl --request PUT \
  --url http://localhost:3005/loandossier/dossiercore/api/b7aad29e-0682-4676-b089-88d5e2ac98f9/documents/loanAgreement \
  --header 'Content-Type: multipart/form-data' \
  --form 'documents=@/home/maksim/Dev/loandossier/test/files/8-1.jpg'
printf "\n"