-- Allow any authenticated user to delete applications
CREATE POLICY "Authenticated users can delete applications"
  ON childminder_applications
  FOR DELETE
  TO authenticated
  USING (true);