# Editing your portfolio

Start the application, open `/admin/27348`, and enter the password from your private `.env.local` file.

## Add a job

1. Choose **Experience**, then **Add experience**.
2. Fill in the company, role, location, employment type, and dates. Use **Present** for an ongoing role.
3. Add a short summary, responsibilities, and technologies.
4. Move the entry up or down if needed, then choose **Save changes**.

New roles are added at the top. A successful save updates the public experience section immediately.

## Add a project

1. Choose **Projects**, then **Add project**.
2. Add the name, category, display number, short summary, and project story.
3. Upload a PNG, JPEG, or WebP screenshot up to 5 MB. Add a useful image description.
4. Add technologies, engineering highlights, and links. Each link needs a label and a full HTTPS address.
5. Add a preview note when a screenshot comes from a local build or a demo has a known limitation.
6. Save changes. The project appears on the homepage and gets its own project page.

The first project in the list is featured. Use the arrows to change its position. Uploading an image alone does not publish the project; save the form afterward. Use **Remove screenshot** to return to the text cover.

## Save behavior

Project and experience drafts stay available when switching tabs. The save button becomes disabled after a successful save and becomes available when you make another edit. Validation errors identify the field to correct.

The editor stores content in `data/projects.json` and `data/experience.json`. Each save backs up the previous JSON file in `data/.backup/`. Image files live in `public/images/projects/`.

Direct JSON edits are also supported; preserve unique entry identifiers and the field structure. Public content normally refreshes within the 60-second revalidation interval; admin saves invalidate that cache immediately.

## Deployment

On a persistent Node.js host, edits and uploaded images remain on disk. On a serverless host such as Vercel, edit locally and redeploy the updated data and public folders. Runtime editing there needs a separate database and image storage service.
