# CasaPerks Rewards Platform

Internal rewards dashboard for resident points and gift card redemptions.

## Quick Start

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Run everything
npm run dev:all
```

Server runs on http://localhost:3001
Client runs on http://localhost:5173

## API Endpoints

- `GET /api/residents` - List all residents
- `GET /api/residents/:id` - Get resident details
- `POST /api/auth/login` - Login
- `GET /api/rewards` - Get gift card catalog
- `POST /api/rewards/redeem` - Redeem points for gift card
- `GET /api/transactions/:residentId` - Get transaction history
- `GET /api/admin/residents` - Admin: all residents with details
- `POST /api/admin/add-points` - Admin: add points to resident
- `GET /api/admin/export` - Admin: export all data

## Test Accounts

- Resident: `maria.garcia@email.com` / `resident123`
- Admin: `admin@casaperks.com` / `admin123!`

## Notes

- Built quickly for internal demo, needs cleanup before production
- Using mock data for now, will connect to MongoDB later
- TODO: add proper error handling
- TODO: set up deployment pipeline
