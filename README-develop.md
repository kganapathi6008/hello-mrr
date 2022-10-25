# gcp-monitoring-to-teams

⚙️ A Cloud Function written in python used to send notifications from [Google Cloud Platform (GCP) Monitoring](https://cloud.google.com/monitoring) static webhook notifications to [Microsoft Teams](https://teams.microsoft.com/).

![Architecture](architecture.png "Architecture")

_Idea from: https://github.com/Courtsite/gcp-monitoring-to-teams & https://github.com/googlecloudplatform/cloud-alerting-notification-forwarding_

## Getting Started

### Prerequisites
- Ensure you have `gcloud` installed:
    - MacOS: `brew cask install google-cloud-sdk`
    - Others: https://cloud.google.com/sdk/gcloud
- Some of these gcloud components will be used: `gcloud components install gsutil alpha beta`
- Ensure you have authenticated with Google Cloud: `gcloud init`
- Set the current working project: `gcloud config set project <PROJECT_ID>`
- To know in which Project you are: `gcloud config get-value core/project`


### Important Points of Pub/Sub and Cloud Monitoring, [Follow this Document](https://cloud.google.com/monitoring/support/notification-options#pubsub)
- This Section is discussing about the Background integration of Pub/Sub and Cloud Monitoring. Precaustion: Don't run these commands, all these commands are already automated in `deploy.sh`
- Create a Pub/Sub topic by using the following command,
    ```bash
    gcloud pubsub topics create <Topic_Name>
    ```
- Create a notification channel and adding the above Pub/Sub topic to this channel.[Refer-here](https://cloud.google.com/sdk/gcloud/reference/beta/monitoring/channels/create)
    ```bash
    gcloud beta monitoring channels create --display-name="<Channel_Name>" \
    --description="<Add Description Here>" \
    --user-labels=channel-name=<Channel_Name>,pubsub-topic=<Topic_Name> \
    --type=pubsub --channel-labels=topic=projects/$PROJECT_NUMBER/topics/<Topic_Name>
    ```
- When we add the first Pub/Sub Topic in the Cloud Monitoring notification channel for a Google Cloud project, Cloud Monitoring creates a service account for that project. It also grants the Identity and Access Management role "Monitoring Notification Service Agent" to the service account. This service account lets Monitoring send notifications to Pub/Sub-based notification channels in this project. The service account has the following format,
    ```bash
    service-$PROJECT_NUMBER@gcp-sa-monitoring-notification.iam.gserviceaccount.com
    ```

    To authorize the service account for our topic, grant the `pubsub.publisher` IAM role for the topic to the service account. For example, the following command configures the IAM role for the specific topic.
    ```bash
    gcloud pubsub topics add-iam-policy-binding \
    projects/$PROJECT_NUMBER/topics/<Topic_Name> --role=roles/pubsub.publisher \
    --member=serviceAccount:service-$PROJECT_NUMBER@gcp-sa-monitoring-notification.iam.gserviceaccount.com
    ```


### Deployment
1. Clone or download a copy of this repository
2. Modify the environment variables declared in the `constants.py` file
    - Update `TeamsWebhookURL`.
        - The reason we want this is to send notification to Teams Channel to POST the Incident Status.
   - Update `greenImageURL` & `redImageURL`.
        - The reason we want this is to get an icon for incident status. Red image refers to incident open. Green image refers to incident closed.
        - Red & Green images are stored in cloud storage (The storage bucket name is color-images-for-mes-build-status) and we made them as public. Whenever any incident open or closed in Cloud Monitoring alerts, based on the incident status it will pick image.
3. Run `./deploy.sh`


### Testing

- To test the function run in Linux/Mac/Gitbash, expecting to see "result: OK"
    ```bash
    gcloud functions call gcp-monitoring-to-teams --region us-east1 --data '{"name": "Hello World"}'
    ```

- To test the function in Windows, we have to use escape characters('\') in powershell
    ```bash
    gcloud functions call gcp-monitoring-to-teams --region us-east1 --data '{\"name\": \"Hello World\"}'
    ```

- To test the function by giving real data, expecting to see "result: OK"
    ```bash
    gcloud functions call gcp-monitoring-to-teams --region us-east1 --data '{"@type": "type.googleapis.com/google.pubsub.v1.PubsubMessage", "attributes": "None", "data": "eyJ2ZXJzaW9uIjoidGVzdCIsImluY2lkZW50Ijp7ImluY2lkZW50X2lkIjoiMTIzNDUiLCJzY29waW5nX3Byb2plY3RfaWQiOiIxMjM0NSIsInNjb3BpbmdfcHJvamVjdF9udW1iZXIiOjEyMzQ1LCJ1cmwiOiJodHRwOi8vd3d3LmV4YW1wbGUuY29tIiwic3RhcnRlZF9hdCI6MCwiZW5kZWRfYXQiOjAsInN0YXRlIjoiT1BFTiIsInN1bW1hcnkiOiJUZXN0IEluY2lkZW50IiwiYXBpZ2VlX3VybCI6Imh0dHA6Ly93d3cuZXhhbXBsZS5jb20iLCJvYnNlcnZlZF92YWx1ZSI6IjEuMCIsInJlc291cmNlIjp7InR5cGUiOiJleGFtcGxlX3Jlc291cmNlIiwibGFiZWxzIjp7ImV4YW1wbGUiOiJsYWJlbCJ9fSwicmVzb3VyY2VfdHlwZV9kaXNwbGF5X25hbWUiOiJFeGFtcGxlIFJlc291cmNlIFR5cGUiLCJyZXNvdXJjZV9pZCI6IjEyMzQ1IiwicmVzb3VyY2VfZGlzcGxheV9uYW1lIjoiRXhhbXBsZSBSZXNvdXJjZSIsInJlc291cmNlX25hbWUiOiJwcm9qZWN0cy8xMjM0NS9leGFtcGxlX3Jlc291cmNlcy8xMjM0NSIsIm1ldHJpYyI6eyJ0eXBlIjoidGVzdC5nb29nbGVhcGlzLmNvbS9tZXRyaWMiLCJkaXNwbGF5TmFtZSI6IlRlc3QgTWV0cmljIiwibGFiZWxzIjp7ImV4YW1wbGUiOiJsYWJlbCJ9fSwibWV0YWRhdGEiOnsic3lzdGVtX2xhYmVscyI6eyJleGFtcGxlIjoibGFiZWwifSwidXNlcl9sYWJlbHMiOnsiZXhhbXBsZSI6ImxhYmVsIn19LCJwb2xpY3lfbmFtZSI6InByb2plY3RzLzEyMzQ1L2FsZXJ0UG9saWNpZXMvMTIzNDUiLCJwb2xpY3lfdXNlcl9sYWJlbHMiOnsiZXhhbXBsZSI6ImxhYmVsIn0sImRvY3VtZW50YXRpb24iOiJUZXN0IGRvY3VtZW50YXRpb24iLCJjb25kaXRpb24iOnsibmFtZSI6InByb2plY3RzLzEyMzQ1L2FsZXJ0UG9saWNpZXMvMTIzNDUvY29uZGl0aW9ucy8xMjM0NSIsImRpc3BsYXlOYW1lIjoiRXhhbXBsZSBjb25kaXRpb24iLCJjb25kaXRpb25UaHJlc2hvbGQiOnsiZmlsdGVyIjoibWV0cmljLnR5cGU9XCJ0ZXN0Lmdvb2dsZWFwaXMuY29tL21ldHJpY1wiIHJlc291cmNlLnR5cGU9XCJleGFtcGxlX3Jlc291cmNlXCIiLCJjb21wYXJpc29uIjoiQ09NUEFSSVNPTl9HVCIsInRocmVzaG9sZFZhbHVlIjowLjUsImR1cmF0aW9uIjoiMHMiLCJ0cmlnZ2VyIjp7ImNvdW50IjoxfX19LCJjb25kaXRpb25fbmFtZSI6IkV4YW1wbGUgY29uZGl0aW9uIiwidGhyZXNob2xkX3ZhbHVlIjoiMC41In19"}'
    ```
