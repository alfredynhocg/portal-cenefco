.PHONY: deploy

deploy:
	git pull origin main && \
	npm ci && \
	node scripts/set-env.js && \
	npx ng build --configuration production && \
	systemctl reload nginx
