local htmlforceftgroup = vim.api.nvim_create_augroup("htmlforceftgroup", { clear = true })
vim.api.nvim_create_autocmd({ "BufReadPost" }, {
	pattern = "*.html",
	callback = function()
		vim.cmd.set([[filetype=htmldjango]])
	end,
	group = htmlforceftgroup,
})
