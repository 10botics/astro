# URL Aliases System

This system provides a centralized way to manage URL aliases for all dynamic route handlers in the Astro project.

## File Structure

- **`src/utils/urlAliases.js`** - Main configuration file containing all URL aliases
- **Dynamic route handlers** - Updated to use the global configuration

## Configuration Format

The `urlAliases` object follows this structure:

```javascript
{
  "foldername": {
    "Filename Display Name": {
      "filename": "actual-file.astro",
      "aliases": ["alias1", "alias2", "alias3"],
      "main": "primary-alias"
    }
  }
}
```

### Folder Names

- **`root`** - Handles `src/pages/[slug].astro`
- **`school-courses`** - Handles `src/pages/school-courses/[slug].astro`
- **`stemday`** - Handles `src/pages/stemday/[slug].astro`
- **`course`** - Handles `src/pages/course/[slug].astro` (redirects)
- **`funding-application`** - Handles `src/pages/funding-application/[slug].astro`
- **`staff-development-day`** - Handles `src/pages/staff-development-day/[slug].astro`

### Example Configuration

```javascript
"school-courses": {
  "Minecraft校園創建課程": {
    "filename": "Minecraft校園創建課程.astro",
    "aliases": ["minecraft", "10botics-x-btehkmu-minecraft", "minecraftbuildmyschool"],
    "main": "minecraft"
  }
}
```

This means:
- **File**: `src/pages/school-courses/Minecraft校園創建課程.astro`
- **URLs that work**: 
  - `/school-courses/minecraft`
  - `/school-courses/10botics-x-btehkmu-minecraft`
  - `/school-courses/minecraftbuildmyschool`
- **Primary URL**: `/school-courses/minecraft`

## Helper Functions

### `getStaticPathsForFolder(folderName)`
Returns all static paths for a specific folder's slug handler.

```javascript
export async function getStaticPaths() {
  return getStaticPathsForFolder('school-courses');
}
```

### `getComponentForSlug(folderName, slug)`
Returns component information for a specific slug in a folder.

```javascript
const componentInfo = getComponentForSlug('school-courses', slug);
// Returns: { filename: "...", redirect: "...", isRedirect: boolean }
```

### `getMainAliasForFile(folderName, filename)`
Gets the main/primary alias for a specific filename.

### `getAllAliasesForFile(folderName, filename)`
Gets all aliases for a specific filename.

## Special Cases

### Redirects
For the `course` folder, entries can have a `redirect` property:

```javascript
"ai-game-coding": {
  "redirect": "/school-courses/ai-game-coding",
  "aliases": ["ai-game-coding"],
  "main": "ai-game-coding"
}
```

### External Redirects
Special handling for external redirects can be added in the route handlers:

```javascript
if (slug === 'timesheet_submission_form') {
  return Astro.redirect('https://otfxid9w.paperform.co');
}
```

## Adding New Aliases

1. **Add to configuration**: Update `src/utils/urlAliases.js`
2. **No code changes needed**: The route handlers automatically pick up new aliases

## Benefits

- **Centralized management**: All URL aliases in one place
- **Consistency**: Same pattern across all folders
- **Maintainability**: Easy to add/remove/modify aliases
- **Type safety**: Helper functions ensure correct usage
- **Automatic generation**: Static paths generated automatically
