
test:
	@./node_modules/.bin/expresso \
		-t 3000 \
		--serial \
		test/cfg.js

.PHONY: test
